export const getWelcomeEmailContent = (name: string) => (`
  <html>
    <body>
      <h1> Welcome <strong>${name}</strong>! </h1>
    </body>
  </html>
`)