import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux'
import {auth} from '../_action/user_action';


export default function (SpecificComponent, option, adminRoute = null){
    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                    console.log(response)
            //로긴 하지않은상태
            if(!response.payload.isAuth) {
                if(option){
                    props.history.push('/login')
                }
            }else{
                //로그인 상태
                if(adminRoute && !response.payload.isAdmin){
                    props.history.push('/')
                }else{
                    if(option === false){
                        props.history.push('/')
                    }
                }
            }
            })
        }, [dispatch, props.history])
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}