import '../static/style/components/footer.css'
import Script from "react-load-script";
const Footer = () => (
    <>
        <Script url="../static/js/heart.js" />

        <div className="footer-div">
            <div>系统由 React+Node+Ant Desgin驱动 </div>
            <div>vencent</div>
        </div>
    </>
)

export default Footer