import CashierTemplate from "@/components/managerTemplate"
import MenuList from "../../menuList"

export const metadata = {
    title: 'Reading ',
    description: 'Generated by create next app',
}

type PropsLayout = {
    children: React.ReactNode
}
const RootLayout = ({ children }: PropsLayout) => {
    return (
        <CashierTemplate title="Reading" id="Reading" menuList={MenuList}>
            {children}
        </CashierTemplate>
    )
}
export default RootLayout