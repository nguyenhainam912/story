import RingLoader from "react-spinners/RingLoader";

const Loading = () => {
    
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    return (
        <div>
            <RingLoader color="#36d7b7" style={style}/>
        </div> 
    )
}
 
export default Loading;