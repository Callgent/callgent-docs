import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '@site/src/store';
import { setCallgent } from '@site/src/store/slices/userSlice';
import { useEffect } from "react";
import styles from "./index.module.css";
import { useHistory } from '@docusaurus/router';
const Email = () => {
    const history = useHistory()
    const { callgent } = useSelector(
        (state: RootState) => state.user
    );
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(setCallgent());
    }, [])
    return (
        <>
            Please create a callgent First!
        </>
    );
};
export default Email;