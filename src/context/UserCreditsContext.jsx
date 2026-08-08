import axiosInstance from '../Util/axiosInstance';
import { createContext, useCallback, useEffect, useState } from 'react'
import apiEndPoints from '../Util/apiEndpoints';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const UserCreditsContext = createContext()

export const UserCreditsProvider = ({ children }) => {

    const [credits, setCredits] = useState(5);
    const [plan, setPlan] = useState('BASIC');
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(25);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();



    // function to fetch the users credits that can be called from anywhere
    const fetchUserCredits = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);

        try {
            // Token is attached automatically by axiosInstance's request interceptor.
            const response = await axiosInstance.get(apiEndPoints.GET_CREDITS)
            if (response.status == 200) {
                setCredits(response.data.credits);
                setPlan(response.data.plan);
                setMaxFileSizeMb(response.data.maxFileSizeMb);


            } else {
                toast.error('Unable to get the credits');
            }

        } catch (error) {
            console.error('Error fetching the use credits', error);


        } finally {
            setLoading(false);
        }

    }, [isAuthenticated]);


    useEffect(() => {
        if (isAuthenticated)
            fetchUserCredits();

    }, [fetchUserCredits, isAuthenticated]);


    const updateCredits = useCallback(newCredits => {
        console.log('Updating the credits ', newCredits);
        setCredits(newCredits);

    }, []);



    const contextValue = {

        credits,
        setCredits,
        plan,
        maxFileSizeMb,
        fetchUserCredits,
        updateCredits

    }

    return (
        <UserCreditsContext.Provider value={contextValue} >
            {children}
        </UserCreditsContext.Provider>
    )

}