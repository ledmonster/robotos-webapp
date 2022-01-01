import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { addresses, abis } from "@project/contracts";

import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import styled from "styled-components";

async function fetchTokenIDs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ceaErc20 = new Contract(addresses.robotos, abis.robotos, provider);
    const myAddress = await signer.getAddress()
    const tokenIDs = await ceaErc20.tokensOfOwner(myAddress)
    return tokenIDs.map(v => { return ethers.utils.formatUnits(v, 0) })
}


const RobotosListComponent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`

const RobotosComponent = styled.div`
width: 400px;
`

const RobotosHeader = styled.h5`
  margin-bottom: 10px;
`;

const RobotosImage = styled.img`
  height: 320px;
  margin-bottom: 10px;
  pointer-events: none;
`;

const RobotosTraits = styled.ul`
  font-size: calc(2px + 2vmin);
`;

export function Robotos(props) {
    const [imageURL, setImageURL] = useState("");
    const [traits, setTraits] = useState([])

    useEffect(() => {
        const jsonURL = "https://gateway.pinata.cloud/ipfs/QmQh36CsceXZoqS7v9YQLUyxXdRmWd8YWTBUz7WCXsiVty/" + props.tokenID
        fetch(jsonURL).then(res => res.json()).then(data => {
            setImageURL(data.image);
            setTraits(data.attributes);
        })
    }, [props.tokenID])

    return (
        <RobotosComponent>
            <RobotosHeader>Roboto #{props.tokenID}</RobotosHeader>
            <RobotosImage src={imageURL} />
            <RobotosTraits>
                {traits.map(trait => {
                    return <li key={props.tokenID + "_" + trait.trait_type}>{trait.trait_type}: {trait.value}</li>
                })}
            </RobotosTraits>
        </RobotosComponent>
    )
}

Robotos.propTypes = {
    tokenID: PropTypes.string.isRequired,
}

export function RobotosList() {
    const [tokenIDs, setTokenIDs] = useState([]);

    useEffect(() => {
        fetchTokenIDs().then(tokenIDs => {
            console.log(tokenIDs);
            setTokenIDs(tokenIDs);
        });
    }, [])
    return (
        <React.Fragment>
            {tokenIDs.map(tokenID => {
                return <Robotos key={tokenID} tokenID={tokenID} />
            })}
        </React.Fragment>
    )
}

Robotos.propTypes = {}
