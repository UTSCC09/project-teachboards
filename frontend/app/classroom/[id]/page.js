"use client";
import ClassroomPage from "../../Components/ClassroomPage/ClassroomPage.js";
import { useSearchParams } from "next/navigation.js";


export default function Classroom({params}) {
    const searchParams = useSearchParams();
    const {id} = params;
    const className = searchParams.get("name");
    return <ClassroomPage className={className} id ={id}/>;
}