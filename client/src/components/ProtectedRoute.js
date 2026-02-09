import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../AppContext";

const ProtectedRoute = ({ children }) => {
    const { groomer, loading } = useContext(AppContext);

    // wait for checksession 
    if (loading) return  null;

    //if not logged in
    if (!groomer) {
        return <Navigate to="/login" replace/>;
    }

    //if logged in
    return children;
};

export default ProtectedRoute;