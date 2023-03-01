const fs = require("fs");
const cl = (sm) => console.log(sm);
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title> Enter message</title></head>");
    res.write("<body style='background-color: bule'>");
    res.write("<form action='/message' method='POST'>");
    res.write("<h1>hello to first server page</h1>");
    res.write("<input type ='text' name='massage'/>");
    res.write("<button type ='submit'>Send</button>");
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    // do 2 thing create a file to store message, and rederect to /
    const body = [];
    req.on("data", (chunk) => {
      cl(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });

    // 302 --- redirect
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title> My first page</title></head>");
    res.write("<body><h1>hello to first server page</h1></body>");
    res.write("</html>");
    res.end();
  }
};
//module.exports = {hadler: requestHandler, someText : 'some hard text code'};
exports.hander = requestHandler;
exports.someText ='Some hard code text';