import { db } from "../../../firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req, { params }) {
    const { id } = params; 
    if (!id){
        return new Response(JSON.stringify({ message: "cannot get times" }),{
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    try {
        const studentDB = query(collection(db, "classRoom"),where("students", "array-contains", id));
        const teacherDB = query(collection(db, "classRoom"),where("teacherID", "==", id));
        const studentdata = await getDocs(studentDB);
        const teacherdata = await getDocs(teacherDB);
       
        const meetingTimes = [];
        studentdata.forEach((doc) => {
            const data = doc.data();
            if (data.meetingtime) {
                Object.entries(data.meetingtime).forEach(([key, value]) => {
                    meetingTimes.push({ key, value: value.code });
                });
            }
        });
        teacherdata.forEach((doc) =>{
            const data = doc.data();
            if (data.meetingtime){
                Object.entries(data.meetingtime).forEach(([key,value]) =>{
                    meetingTimes.push({key, code:value.code});
                });
            }
        })
        return new Response(JSON.stringify(meetingTimes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Cannot retrive times", error);
        return new Response(JSON.stringify({ message: "cannot get times" }),{
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
