// components/Footer.tsx
export default function Footer() {
    return (
        <footer className=" text-white p-4 text-center" style={{ backgroundColor: '#7a0e01', color: 'white' }}>
            <p>&copy; {new Date().getFullYear()} FI Institute. All rights reserved.</p>
        </footer>
    );
}
