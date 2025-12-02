import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import NavBar from './NavBar';
import "@testing-library/jest-dom";


import { useUser, useClerk } from "@clerk/clerk-react";

vi.mock("react-router",()=>{
    return {
        Link:({children}: {children: React.ReactNode})=><a>{children}</a>,
        useNavigate:vi.fn()
    }
})

vi.mock("@clerk/clerk-react",()=>{
    const UserButton=({children}:{children:React.ReactNode})=>(
        <div data-testid="user-btn">{children}</div>
    )
    UserButton.MenuItems=({children}:{children:React.ReactNode})=>(
        <div data-testid="menu-items">{children}</div>
    )
    UserButton.Action=({label, onClick}:{label:string,onClick:React.MouseEventHandler<HTMLButtonElement>})=>(
        <button onClick={onClick} data-testid="menu-action">{label}</button>
    )
    return {
        UserButton,
        useClerk:vi.fn(),
        useUser:vi.fn()
    }
})


describe('NavBar Component Testing',()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it('shows Login button when user is not looged in',()=>{
        vi.mocked(useUser).mockReturnValue({user:null, isLoaded:true, isSignedIn:false});
        vi.mocked(useClerk).mockReturnValue({openSignIn:vi.fn()} as unknown as ReturnType<typeof useClerk>)
        
        render(<NavBar/>);

        expect(screen.getByText("Login")).toBeInTheDocument();
    })
})