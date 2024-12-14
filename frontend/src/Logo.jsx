import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons'; // Correct import for faRocketchat

export default function Logo() {
  return (
    <div className="bg-white font-bold flex items-center gap-2 px-4 py-1 sm:text-sm sm:p-1 sm:gap-0 text-white">
      <FontAwesomeIcon icon={faRocketchat} className='text-blue-800 font-bold w-8 h-8 pl-4 sm:p-1 sm:h-4 sm:w-4'/>    
      <span className="text-sm font-bold text-black ml-2">Live-Chat</span>
    </div>
  );
}
