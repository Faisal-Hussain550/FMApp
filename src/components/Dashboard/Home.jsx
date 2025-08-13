
import Footer from "./Footer";
import Nav from "./Nav";

const Home = () => {
  return (
    <div>
      <Nav />
      <div style={{ padding: "20px" }}>
        <h1>Welcome to the Dashboard</h1>
        <p>This is your home page.</p>
      </div>
       <Footer />
    </div>
  );
};


export default Home;
