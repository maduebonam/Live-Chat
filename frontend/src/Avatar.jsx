export default function Avatar({userId,username, isOnline}) {
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-purple-200',
         'bg-yellow-200', 'bg-green-200', 'bg-teal-200'];
const userIdBase10 = parseInt(userId, 16);
const colorIndex = userIdBase10 % colors.length;
const color = colors[colorIndex];

    return (
        <div className={`w-8 h-8 relative rounded-full flex items-center justify-center ${color}`}>
        <div className="text-center w-full opacity-70">{username[0]?.toUpperCase() || "?"}</div>
        <div className={`absolute w-3 h-3 sm:text-sm bottom-0 right-0 rounded-full border border-white ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
      </div>
    //     <div className={`w-8 h-8 relative rounded-full flex items-center justify-center ${color}`}>
    //         <div className="text-center w-full opacity-70">{username[0]?.toUpperCase() || "?"}</div>
    //    {uniqueOnline && (
    //    <div className="absolute w-3 sm:text-sm h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white "></div>
    //    )}
    //    {!isOnline && (
    //      <div className="absolute w-3 h-3 sm:text-sm bg-gray-400 bottom-0 right-0 rounded-full border border-white "></div>
    //    )}
    //     </div>
    );
}