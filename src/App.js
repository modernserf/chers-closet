import './App.css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { shirts, pants, getMatch } from './data'
import background from './img/leopard-skin-print-pattern.jpg'
import bgBottom from './img/bg-bottom.png'
import bgTop from './img/bg-top.png'

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
    padding: 0 12px;
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

const ImageLayer = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
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

const mismatchLoop = keyframes`
    0% {
        opacity: 0;
    }
    49% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
`

const MismatchContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Mismatch = styled.div`
    font-size: 16vh;
    text-align: center;
    border: 2px solid black;
    background-color: #CBCCFE;
    box-shadow: 10px 10px 0 black;
    padding: 4vh 2vh 0;
    line-height: 12vh;
    animation: ${mismatchLoop} 1s linear infinite;
`

class OutfitVisualizer extends React.Component {
    static propTypes = {
        outfit: PropTypes.object.isRequired,
    }
    state = {
        step: 0,
    }
    componentDidMount () {
        this.runLoop()
    }
    runLoop = () => {
        if (this.state.step < 3) {
            setTimeout(() => {
                this.setState(({ step }) => ({ step: step + 1 }))
                this.runLoop()
            }, 500)
        }
    }
    render () {
        const { outfit: { shirtImg, pantsImg, shoesImg } } = this.props
        const { step } = this.state
        const lgroups = [
            [bgTop],
            [shirtImg],
            [shirtImg, pantsImg],
            [shirtImg, pantsImg, shoesImg],
        ]

        return (
            <ItemSelectorContainer>
                <ItemContainer image={bgBottom} />
                {lgroups[step].map((img) => (
                    <ImageLayer image={img} key={img} />
                ))}
            </ItemSelectorContainer>
        )
    }
}

const Rev = styled.div`
    transform: rotateY(180deg);
`

function ItemSelector ({ value, options, onPlay, onPrev, onNext }) {
    return (
        <ItemSelectorContainer>
            <ItemContainer image={value.src} />
            <Transport>
                <TransportButton onClick={onPrev}><Rev>►►</Rev></TransportButton>
                <TransportButton onClick={onPlay}>►</TransportButton>
                <TransportButton onClick={onNext}>►►</TransportButton>
            </Transport>
        </ItemSelectorContainer>
    )
}

const navItems = ['shoes', 'jackets', 'cravats', 'pocket squares', 'underwear', 'cardigans', 'sweaters']

function mod (a, b) {
    return ((a % b) + b) % b
}

function getAtIndex (items, index) {
    return items[mod(index, items.length)]
}

class App extends Component {
    state = {
        shirtIndex: 0,
        pantsIndex: 0,
        mismatch: false,
        outfit: null,
    }
    browse = () => {
        this.setState({ outfit: null })
    }
    tick = (key, value) => () => {
        this.setState((prevState) => ({[key]: prevState[key] + value}))
    }
    dressMe = () => {
        const { shirtIndex, pantsIndex } = this.state
        const match = getMatch(
            getAtIndex(shirts, shirtIndex).id,
            getAtIndex(pants, pantsIndex).id
        )
        if (!match) {
            this.setState({ mismatch: true })
            setTimeout(() => {
                this.setState({ mismatch: false })
            }, 3000)
            return
        }
        this.setState({ outfit: match })
    }
    render () {
        const { shirtIndex, pantsIndex, mismatch, outfit } = this.state
        return (
            <Container>
                <Header>
                    {"Justin's Wardrobe"}
                </Header>
                <Body>
                    <BigButton onClick={this.browse}>Browse</BigButton>
                    {outfit ? (
                        <OutfitSelector>
                            <OutfitVisualizer outfit={outfit}/>
                        </OutfitSelector>
                    ) : (
                        <OutfitSelector>
                            <ItemSelector
                                value={getAtIndex(shirts, shirtIndex)}
                                options={shirts}
                                onPrev={this.tick('shirtIndex', -1)}
                                onNext={this.tick('shirtIndex', 1)}
                            />
                            <ItemSelector
                                value={getAtIndex(pants, pantsIndex)}
                                options={pants}
                                onPrev={this.tick('pantsIndex', -1)}
                                onNext={this.tick('pantsIndex', 1)}
                            />
                        </OutfitSelector>
                    )}
                    <BigButton onClick={this.dressMe}>Dress Me</BigButton>
                </Body>
                <Footer>
                    <FooterNav>
                        {navItems.map((item) => <NavLink key={item}>
                            {item}
                        </NavLink>)}
                    </FooterNav>
                </Footer>
                {mismatch && (
                    <MismatchContainer>
                        <Mismatch>Mis-match!</Mismatch>
                    </MismatchContainer>
                )}
            </Container>
        )
    }
}

export default App
