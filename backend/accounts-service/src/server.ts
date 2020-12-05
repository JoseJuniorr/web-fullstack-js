import app from "./app";

const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
