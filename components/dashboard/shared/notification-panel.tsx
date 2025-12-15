import { getUserNotifications } from "@/app/actions/notifications";

const NotificationPanel = async () => {

    const data = await getUserNotifications();
    return (
        <>

            {data.map((item) => (
                <div key={item.id}>
                    {/* <h2>{item.title}</h2>
                    <p>{item.message}</p> */}

                    {item.notificationType}
                </div>
            ))}
            <h1>Notification Panel</h1>
        </>
    );
};

export default NotificationPanel;