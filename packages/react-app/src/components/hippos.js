import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { addresses, abis } from "@project/contracts";

import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import styled from "styled-components";

async function fetchTokenIDs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ceaErc20 = new Contract(addresses.hippos, abis.hippos, provider);
    const myAddress = await signer.getAddress()
    const tokenIDs = await ceaErc20.tokensOfOwner(myAddress)
    return tokenIDs.map(v => { return ethers.utils.formatUnits(v, 0) })
}


const HipposListComponent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`

const HipposComponent = styled.div`
width: 400px;
`

const HipposHeader = styled.h5`
  margin-bottom: 10px;
`;

const HipposImage = styled.img`
  height: 32vmin;
  margin-bottom: 10px;
  pointer-events: none;
`;

const HipposTraits = styled.ul`
  font-size: calc(2px + 2vmin);
`;

export function Hippos(props) {
    const [imageURL, setImageURL] = useState("");
    const [traits, setTraits] = useState([])

    useEffect(() => {
        const proxyURL = "https://cors-anywhere.herokuapp.com/"
        const jsonURL = "https://nft.bueno.art/api/d530a7b2d3fc4437b3d053feecde164e/token/metadata/" + props.tokenID
        fetch(proxyURL + jsonURL, {mode: 'cors'}).then(res => res.json()).then(data => {
            setImageURL(data.image);
            setTraits(data.attributes);
        })
    }, [props.tokenID])

    return (
        <HipposComponent>
            <HipposHeader>Hippo #{props.tokenID}</HipposHeader>
            <HipposImage src={imageURL} />
            <HipposTraits>
                {traits.map(trait => {
                    return <li key={props.tokenID + "_" + trait.trait_type}>{trait.trait_type}: {trait.value}</li>
                })}
            </HipposTraits>
        </HipposComponent>
    )
}

Hippos.propTypes = {
    tokenID: PropTypes.string.isRequired,
}

export function HipposList() {
    const [tokenIDs, setTokenIDs] = useState([]);

    useEffect(() => {
        fetchTokenIDs().then(tokenIDs => {
            console.log(tokenIDs);
            setTokenIDs(tokenIDs);
        });
    }, [])
    return (
        <HipposListComponent>
            {tokenIDs.map(tokenID => {
                return <Hippos key={tokenID} tokenID={tokenID} />
            })}
        </HipposListComponent>
    )
}

Hippos.propTypes = {}
