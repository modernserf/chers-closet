import './App.css'
import React, { Component } from 'react'
import styled from 'styled-components'
import background from './img/leopard-skin-print-pattern.jpg'
import demoShirt from './img/demo-shirt.png'
import demoPants from './img/demo-pants.png'

const Container = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-image: url(${background});
    background-size: cover;
    font-family: "Chicago";
    text-transform: uppercase;
`

const Header = styled.header`
    color: white;
    background-color: black;
    border-top: 2px solid #ccc;
    height: 2em;
    padding: 6px 8px 0;
    font-size: 24px;
`

const Footer = Header.withComponent('footer')

const FooterNav = styled.nav`
    display: flex;
    flex-direction: row;
`

const NavLink = styled.a`
    padding: 0 8px;
`

const Body = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: center;
    align-items: flex-end;
`

const BigButton = styled.button`
    appearance: none;
    border-width: 8px;
    font-size: 32px;
    width: 150px;
    height: 100px;
    font-family: "Chicago";
    text-transform: uppercase;
    line-height: 30px;
`

const OutfitSelector = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    align-self: stretch;
`

const ItemContainer = styled.div`
    background-color: white;
    border-width: 8px;
    border-style: outset;
    flex-grow: 1;
    background-image: url(${({ image }) => image});
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
`

const ItemSelectorContainer = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
`

const Transport = styled.div`
    display: flex;
    flex-direction: row;
`
const TransportButton = styled.button`
    appearance: none;
    flex-grow: 1;
    font-size: 18px;
    border-width: 4px;
`

const Rev = styled.div`
    transform: rotateY(180deg);
`

function ItemSelector ({ value, options, onPlay, onPrev, onNext }) {
    return (
        <ItemSelectorContainer>
            <ItemContainer image={value.image} />
            <Transport>
                <TransportButton onClick={onPrev}><Rev>►►</Rev></TransportButton>
                <TransportButton onClick={onPlay}>►</TransportButton>
                <TransportButton onClick={onNext}>►►</TransportButton>
            </Transport>
        </ItemSelectorContainer>
    )
}

const navItems = ['shoes', 'jewelry', 'scarves', 'pantyhose', 'underwear', 'pants', 'sweaters']

class App extends Component {
    render () {
        return (
            <Container>
                <Header>
                    {"Justin's Wardrobe"}
                </Header>
                <Body>
                    <BigButton>Browse</BigButton>
                    <OutfitSelector>
                        <ItemSelector value={{ image: demoShirt }} />
                        <ItemSelector value={{ image: demoPants }} />
                    </OutfitSelector>
                    <BigButton>Dress Me</BigButton>
                </Body>
                <Footer>
                    <FooterNav>
                        {navItems.map((item) => <NavLink key={item}>
                            {item}
                        </NavLink>)}
                    </FooterNav>
                </Footer>
            </Container>
        )
    }
}

export default App
