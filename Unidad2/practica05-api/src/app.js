const express = require("express")
const cors = require("cors");
const routerApi = require("./routes"); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Express running");
});

routerApi(app);

app.listen(PORT, () => {
    console.log("App running at port ", PORT);
});
