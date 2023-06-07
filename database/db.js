import mongoose from "mongoose";

const Connection = async (username, password, db_name) => {
  const URL = `mongodb+srv://${username}:${password}@cluster0.jfrinjg.mongodb.net/${db_name}?retryWrites=true&w=majority`
  // const URL = `mongodb://127.0.0.1:27017/${db_name}`
  try {
    await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log('Database Connected Succesfully');
  } catch (error) {
    console.log('Error: ', error.message);
  }

};

export default Connection;