import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '@site/src/store';
import { setBotlet } from '@site/src/store/slices/userSlice';
import { useEffect } from "react";
import styles from "./index.module.css";
import { useHistory } from '@docusaurus/router';
const Email = () => {
    const history = useHistory()
    const { botlet } = useSelector(
        (state: RootState) => state.user
    );
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(setBotlet());
    }, [])
    return (
        <>
            Please create a botlet First!
        </>
    );
};
export default Email;