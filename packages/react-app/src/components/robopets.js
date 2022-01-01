import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { addresses, abis } from "@project/contracts";

import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import styled from "styled-components";

async function fetchTokenIDs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ceaErc20 = new Contract(addresses.robopets, abis.robopets, provider);
    const myAddress = await signer.getAddress()
    const tokenIDs = await ceaErc20.tokensOfOwner(myAddress)
    return tokenIDs.map(v => { return ethers.utils.formatUnits(v, 0) })
}


const RobopetsListComponent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`

const RobopetsComponent = styled.div`
  width: 400px;
`

const RobopetsHeader = styled.h5`
  margin-bottom: 10px;
`;

const RobopetsImage = styled.img`
  height: 320px;
  margin-bottom: 10px;
  pointer-events: none;
`;

const RobopetsTraits = styled.ul`
  font-size: calc(2px + 2vmin);
`;

export function Robopets(props) {
    const [imageURL, setImageURL] = useState("");
    const [traits, setTraits] = useState([])

    useEffect(() => {
        const jsonURL = "https://robotos.mypinata.cloud/ipfs/Qmcsxe8HzSZeTheQeQzUyUJJZW596SRbS3ynKt9cEpLbJQ/" + props.tokenID
        fetch(jsonURL).then(res => res.json()).then(data => {
            setImageURL(data.image);
            setTraits(data.attributes);
        })
    }, [props.tokenID])

    return (
        <RobopetsComponent>
            <RobopetsHeader>Robopet #{props.tokenID}</RobopetsHeader>
            <RobopetsImage src={imageURL} />
            <RobopetsTraits>
                {traits.map(trait => {
                    return <li key={props.tokenID + "_" + trait.trait_type}>{trait.trait_type}: {trait.value}</li>
                })}
            </RobopetsTraits>
        </RobopetsComponent>
    )
}

Robopets.propTypes = {
    tokenID: PropTypes.string.isRequired,
}

export function RobopetsList() {
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
                return <Robopets key={tokenID} tokenID={tokenID} />
            })}
        </React.Fragment>
    )
}

Robopets.propTypes = {}
