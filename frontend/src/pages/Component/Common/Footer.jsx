import "../../css/Footer.css"

const Footer = () => {
  const year = new Date().getFullYear();

  return (
      <footer className="footer">
        <div className="footer-content">
          <p>© {year} ANU Copyright. All rights reserved.</p>
          <p className="footer-description">Developed by WaterPark Team | Designed for usability and accessibility</p>
        </div>
      </footer>
  );
};

export default Footer;