import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Tailwind,
} from '@react-email/components';

export function Layout({
    preview,
    children,
}: {
    preview: string;
    children: React.ReactNode;
}) {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="bg-white max-w-md p-6">
                        {children}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
