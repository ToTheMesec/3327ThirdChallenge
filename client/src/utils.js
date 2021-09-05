export const tokenName = (tokenAddress) => {
    switch (tokenAddress) {
        case "0x0000000000000000000000000000000000000000":
            return "ETH";
        case "0xdc31ee1784292379fbb2964b3b9c4124d8f89c60":
            return "DAI";
        case "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c":
            return "ENJ";
        case "0x3845badAde8e6dFF049820680d1F14bD3903a5d0":
            return "SAND";
        case "0xa117000000f279d81a1d3cc75430faa017fa5a2e":
            return "ANT";
    }
}

export const getCampaigns = async () =>  {
    try {
      const response = await fetch("http://localhost:5000/campaigns")
      const jsonData = await response.json()

      return jsonData;

    } catch (err) {
      console.log(err.message);
    }
}

export const getCampaign = async  () => {
    try {
        const lastItem = window.location.pathname.split("/").pop()
        const response = await fetch("http://localhost:5000/campaigns/" + lastItem)
        const jsonData = await response.json()

        return [jsonData, '/campaign-donation/' + jsonData.camp_id]

    } catch (err) {
        console.log(err.message);
    }
}

export const withdrawL2 = async (id) => {
    try {
        const response = await fetch("http://localhost:5000/campaigns/layer2/:id");
        const jsonData = await response.json();

        return jsonData;
    } catch (err) {
        console.log(err.message);
    }
}