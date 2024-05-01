import ForumIcon from "@mui/icons-material/Forum";
import React from "react";
import {UserDTO} from "../../redux/auth/AuthModel";
import styles from './WelcomePage.module.scss';

interface WelcomePageProps {
    reqUser: UserDTO | null;
}

const WelcomePage = (props: WelcomePageProps) => {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.innerWelcomeContainer}>
                <ForumIcon sx={{
                    width: '10rem',
                    height: '10rem',
                }}/>
                <h1>Welcome, {props.reqUser?.fullName}!</h1>
                <p>Chat App designed and developed by Nicolas Justen.</p>
            </div>
        </div>
    );
};

export default WelcomePage;