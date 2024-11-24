export default function Chat() {
    return (
        <div className="flex h-screen">
            <div className="bg-blue-100 w-1/3">
            contacts
            </div>
            <div className="bg-blue-300 w-2/3">
            <div>messages with selected person</div>
            <div>
            <input type="text" placeholder="Type your message here" className="bg-white border p-2" />
            <button></button>
            </div>
            </div>
        </div>
    )
}