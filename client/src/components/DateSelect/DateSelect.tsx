import { useState } from "react";
import BlurCircle from "../BlurCircle/BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


interface DateTime {
  [date: string]: { time: string; showId: string }[];
}

function DateSelect({ dateTime, id }: { dateTime: DateTime; id: string }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selectedDate) {
      return toast("Please select a date");
    }
    navigate(`/movies/${id}/${selectedDate}`);
    scrollTo(0, 0);
  };
  return (
    <div id="dateSelect" className="pt-30">
      <div className="relative flex bg-primary/10 flex-col md:flex-row items-center justify-between gap-10 p-8 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />
        <div>
          <p className="text-lg font-semibold">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5 ">
            <ChevronLeftIcon
              width={28}
              className="text-primary/80 cursor-pointer"
            />
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(dateTime).map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                  }}
                  className={`flex flex-col item-center justify-center h-14 w-14 aspect-square rounded cursor-pointer 
                            
                            hover:bg-primary/20
                            border border-primary/60 ${
                              selectedDate == date
                                ? "bg-primary/80 hover:bg-primary/80"
                                : ""
                            }`}
                >
                  <span>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  <span>{new Date(date).getDate()}</span>
                </button>
              ))}
            </span>
            <ChevronRightIcon
              width={28}
              className="text-primary/80 cursor-pointer"
            />
          </div>
        </div>
        <button
          onClick={() => {
            onBookHandler();
          }}
          className="bg-primary text-white px-9 py-2 mt-6 rounded-full hover:bg-primary/90 transition-all cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default DateSelect;
