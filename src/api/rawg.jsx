import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "a0ccc7e743fd4bfc8fa444832c73109c", // your RAWG API key
  },
});
