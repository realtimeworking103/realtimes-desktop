import net from "net";
import tls from "tls";
import http2 from "http2";

export function connectH2ViaHttpProxy({
  proxyUrl,
  targetHost,
  targetPort = 443,
  alpn = ["h2", "http/1.1"],
  timeoutMs = 15000,
}: {
  proxyUrl: string;
  targetHost: string;
  targetPort?: number;
  alpn?: string[];
  timeoutMs?: number;
}): Promise<http2.ClientHttp2Session> {
  return new Promise((resolve, reject) => {
    const p = new URL(proxyUrl);
    const auth =
      p.username || p.password
        ? "Proxy-Authorization: Basic " +
          Buffer.from(
            `${decodeURIComponent(p.username)}:${decodeURIComponent(
              p.password,
            )}`,
          ).toString("base64") +
          "\r\n"
        : "";
    const connectReq =
      `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\n` +
      `Host: ${targetHost}:${targetPort}\r\n` +
      auth +
      `Connection: keep-alive\r\n\r\n`;

    const socket = net.connect({
      host: p.hostname,
      port: Number(p.port || 8080),
    });
    const onError = (e: Error) => reject(e);
    socket.setTimeout(timeoutMs, () =>
      onError(new Error("Proxy connect timeout")),
    );
    socket.once("error", onError);
    socket.once("connect", () => socket.write(connectReq));

    let buf = Buffer.alloc(0);
    socket.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const headerEnd = buf.indexOf("\r\n\r\n");
      if (headerEnd === -1) return;

      const headerText = buf.slice(0, headerEnd).toString("utf8");
      const ok = /^HTTP\/1\.\d 200 /.test(headerText);
      const rest = buf.slice(headerEnd + 4);
      socket.removeAllListeners("data");

      if (!ok) {
        socket.destroy();
        return reject(
          new Error(`Proxy CONNECT failed: ${headerText.split("\r\n")[0]}`),
        );
      }

      socket.setTimeout(0);
      socket.removeListener("error", onError);

      const tlsSocket = tls.connect({
        socket,
        servername: targetHost,
        ALPNProtocols: alpn,
      });
      tlsSocket.setTimeout(timeoutMs, () =>
        tlsSocket.destroy(new Error("TLS handshake timeout")),
      );
      tlsSocket.once("error", reject);
      if (rest.length) tlsSocket.unshift(rest);

      tlsSocket.once("secureConnect", () => {
        const session = http2.connect(`https://${targetHost}:${targetPort}`, {
          createConnection: () => tlsSocket,
        });
        session.once("error", reject);
        session.once("connect", () => resolve(session));
      });
    });
  });
}
