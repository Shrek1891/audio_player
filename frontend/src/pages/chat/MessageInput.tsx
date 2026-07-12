import { Input } from "../../components/ui/input.tsx";
import { Button } from "../../components/ui/button.tsx";
import { RiMailSendFill } from "react-icons/ri";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { getSelectedUser } from "../../features/chat.ts";
import { useSendMessageMutation } from "../../features/chatApi.ts";


const MessageInput = () => {
    const [newMessage, setNewMessage] = useState("");
    const { user } = useUser();
    const selectedUser = useSelector(getSelectedUser);
    const [sendMessage] = useSendMessageMutation();

    const handleSend = async () => {
        if (!selectedUser || !user || !newMessage) return;
        try {
            await sendMessage({
                receiverId: selectedUser.clerkId,
                senderId: user?.id,
                content: newMessage.trim(),
            });
        } catch (error) {
            console.log(error);
        }
        setNewMessage("");
    };

    return (
        <div className='p-4 mt-auto border-t border-zinc-800'>
            <div className='flex gap-2'>
                <Input
                    placeholder='Type a message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='bg-zinc-800 border-none'
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()} className="bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 cursor-pointer">
                    <RiMailSendFill className='size-4' />
                </Button>
            </div>
        </div>
    );
};
export default MessageInput;