import React from "react";
import "./ClassroomPage.css";

export default function ClassroomPage() {

    const dates = ["Date 1", "Date 2", "Date 3", "Date 4", "Date 5"];
    //add sorting fuctions 
    return (
        <div className="ClassroomPageContainer">
            <div className="ClassroomHeader">
                <h2 className="title">Classroom Name</h2>
                <div className="SortOptions">
                    <div className="SortButton">Sort</div>
                </div>
            </div>
            <div className="DateComponentHolder">
                {dates.map((date, index) => (
                    <div key={index} className="DateBox">
                        {date}
                    </div>
                ))}
            </div>
        </div>
    );
}
