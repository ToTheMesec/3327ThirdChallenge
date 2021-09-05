import React from 'react'
import {NavLink} from 'react-router-dom';
import '../App.css';
import profimg from '../images/profileimage.png';
import donoapp from '../images/donoapp.png';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200&display=swap" rel="stylesheet"></link>
            <div id="navbar" className="container px-4 px-lg-5" >
                <NavLink exact to="/" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "22px"}}><svg width="120" height="50" viewBox="0 0 1920 551" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M495.6 114.495C488.804 104.848 473.96 112.472 477.879 123.602C487.145 149.914 491.756 181.485 486.458 218.273C471.334 323.159 388.295 365.666 361.289 376.839C356.536 378.806 351.085 376.825 348.645 372.295C346.554 368.415 347.218 363.619 350.332 360.497C361.455 349.338 386.565 320.165 392.465 279.212C392.816 276.795 393.1 274.379 393.328 271.967C394.366 260.898 379.185 256.942 374.237 266.897C340.81 334.124 267.031 350.428 236.244 350.428C236.244 350.428 234.277 350.39 233.656 350.39C211.68 350.39 146.74 365.714 136.92 433.803C130.45 478.693 152.181 535.329 234.727 547.227C248.642 549.232 262.638 550.25 276.316 550.25C428.49 550.25 528.032 429.358 544.431 315.611C555.71 237.368 532.748 167.218 495.6 114.495Z" fill="#1D1F20"/>
                    <path d="M186.034 173.406C190.788 171.44 196.238 173.425 198.669 177.955C200.755 181.841 200.086 186.636 196.963 189.753C185.84 200.865 160.777 229.92 154.848 271.043C154.498 273.479 154.209 275.914 153.981 278.34C152.948 289.394 168.114 293.351 173.053 283.405C206.47 216.136 280.278 199.827 311.07 199.827C311.07 199.827 313.036 199.865 313.657 199.865C335.634 199.865 400.579 184.541 410.394 116.452C416.863 71.5621 395.128 14.9255 312.586 3.02775C298.671 1.01399 284.68 0 270.998 0C118.824 0 19.2864 120.892 2.88322 234.634C-8.40138 312.915 14.5896 383.098 51.7705 435.831C58.5668 445.468 73.3918 437.849 69.4723 426.733C60.183 400.403 55.5525 368.798 60.8607 331.968C75.9842 227.086 159.029 184.579 186.034 173.406Z" fill="#24E299"/>
                    <path d="M743.908 43.821H773.382C772.956 17.8977 751.649 0 719.263 0C687.374 0 664.007 17.6136 664.149 44.0341C664.078 65.483 679.206 77.7699 703.78 83.6648L719.618 87.6421C735.456 91.4773 744.263 96.0227 744.334 105.824C744.263 116.477 734.178 123.722 718.553 123.722C702.572 123.722 691.067 116.335 690.072 101.776H660.314C661.095 133.239 683.609 149.503 718.908 149.503C754.419 149.503 775.3 132.528 775.371 105.895C775.3 81.6761 757.047 68.821 731.763 63.1392L718.695 60.0142C706.053 57.1023 695.47 52.4148 695.683 41.9744C695.683 32.5994 703.993 25.7102 719.05 25.7102C733.751 25.7102 742.771 32.3864 743.908 43.821Z" fill="#1D1F20"/>
                    <path d="M862.045 100.994C862.116 115.625 852.102 123.295 841.236 123.295C829.801 123.295 822.415 115.27 822.344 102.415V38.3523H792.088V107.812C792.159 133.31 807.074 148.864 829.02 148.864C845.426 148.864 857.216 140.412 862.116 127.628H863.253V147.443H892.301V38.3523H862.045V100.994Z" fill="#1D1F20"/>
                    <path d="M913.102 188.352H943.358V129.972H944.281C948.471 139.063 957.633 149.219 975.247 149.219C1000.1 149.219 1019.49 129.545 1019.49 93.0398C1019.49 55.5398 999.253 36.9318 975.318 36.9318C957.065 36.9318 948.329 47.7983 944.281 56.6761H942.932V38.3523H913.102V188.352ZM942.719 92.8977C942.719 73.4375 950.957 61.0085 965.659 61.0085C980.645 61.0085 988.599 74.0057 988.599 92.8977C988.599 111.932 980.503 125.142 965.659 125.142C951.099 125.142 942.719 112.358 942.719 92.8977Z" fill="#1D1F20"/>
                    <path d="M1036.26 188.352H1066.52V129.972H1067.44C1071.63 139.063 1080.8 149.219 1098.41 149.219C1123.27 149.219 1142.66 129.545 1142.66 93.0398C1142.66 55.5398 1122.42 36.9318 1098.48 36.9318C1080.23 36.9318 1071.49 47.7983 1067.44 56.6761H1066.09V38.3523H1036.26V188.352ZM1065.88 92.8977C1065.88 73.4375 1074.12 61.0085 1088.82 61.0085C1103.81 61.0085 1111.76 74.0057 1111.76 92.8977C1111.76 111.932 1103.67 125.142 1088.82 125.142C1074.26 125.142 1065.88 112.358 1065.88 92.8977Z" fill="#1D1F20"/>
                    <path d="M1208.72 149.574C1241.81 149.574 1262.41 126.918 1262.41 93.3239C1262.41 59.517 1241.81 36.9318 1208.72 36.9318C1175.62 36.9318 1155.02 59.517 1155.02 93.3239C1155.02 126.918 1175.62 149.574 1208.72 149.574ZM1208.86 126.136C1193.59 126.136 1185.78 112.145 1185.78 93.1108C1185.78 74.0767 1193.59 60.0142 1208.86 60.0142C1223.84 60.0142 1231.66 74.0767 1231.66 93.1108C1231.66 112.145 1223.84 126.136 1208.86 126.136Z" fill="#1D1F20"/>
                    <path d="M1278.68 147.443H1308.94V85.7244C1308.94 72.3011 1318.74 63.0682 1332.09 63.0682C1336.28 63.0682 1342.04 63.7784 1344.88 64.7017V37.8551C1342.18 37.2159 1338.41 36.7898 1335.36 36.7898C1323.14 36.7898 1313.13 43.8921 1309.15 57.3864H1308.02V38.3523H1278.68V147.443Z" fill="#1D1F20"/>
                    <path d="M1420.61 38.3523H1400.09V12.2159H1369.83V38.3523H1354.92V61.0795H1369.83V117.898C1369.69 139.276 1384.25 149.858 1406.2 148.935C1414.01 148.651 1419.55 147.088 1422.6 146.094L1417.84 123.58C1416.35 123.864 1413.16 124.574 1410.32 124.574C1404.28 124.574 1400.09 122.301 1400.09 113.92V61.0795H1420.61V38.3523Z" fill="#1D1F20"/>
                    <path d="M871.592 395.609C865.121 341.952 824.478 311.096 770.665 311.096C709.246 311.096 662.359 354.43 662.359 430.435C662.359 506.212 708.452 549.773 770.665 549.773C830.267 549.773 866.256 510.183 871.592 467.416L821.866 467.189C817.212 492.032 797.685 506.326 771.46 506.326C736.153 506.326 712.198 480.121 712.198 430.435C712.198 382.109 735.812 354.544 771.8 354.544C798.707 354.544 818.12 370.085 821.866 395.609H871.592Z" fill="black"/>
                    <path d="M948.862 445.862C948.976 423.401 962.713 410.242 982.466 410.242C1002.11 410.242 1013.69 422.834 1013.57 444.274V546.597H1061.94V435.653C1062.05 394.815 1037.98 370.085 1001.65 370.085C975.201 370.085 957.49 382.563 949.543 403.096H947.5V314.272H900.499V546.597H948.862V445.862Z" fill="black"/>
                    <path d="M1094.56 546.597H1142.92V372.354H1094.56V546.597ZM1118.86 349.892C1133.27 349.892 1145.08 338.889 1145.08 325.39C1145.08 312.004 1133.27 301 1118.86 301C1104.55 301 1092.75 312.004 1092.75 325.39C1092.75 338.889 1104.55 349.892 1118.86 349.892Z" fill="black"/>
                    <path d="M1224.59 314.272H1176.23V546.597H1224.59V314.272Z" fill="black"/>
                    <path d="M1322.16 549.433C1350.31 549.433 1364.96 533.211 1371.66 518.691H1373.7V546.597H1421.38V314.272H1373.13V401.621H1371.66C1365.18 387.441 1351.22 370.085 1322.04 370.085C1283.79 370.085 1251.43 399.806 1251.43 459.702C1251.43 518.01 1282.42 549.433 1322.16 549.433ZM1337.48 510.977C1313.76 510.977 1300.81 489.877 1300.81 459.475C1300.81 429.3 1313.53 408.541 1337.48 408.541C1360.98 408.541 1374.15 428.393 1374.15 459.475C1374.15 490.558 1360.76 510.977 1337.48 510.977Z" fill="black"/>
                    <path d="M1455.71 546.597H1504.07V448.018C1504.07 426.578 1519.74 411.831 1541.08 411.831C1547.78 411.831 1556.98 412.965 1561.52 414.44V371.559C1557.2 370.539 1551.19 369.858 1546.31 369.858C1526.78 369.858 1510.77 381.202 1504.41 402.755H1502.6V372.354H1455.71V546.597Z" fill="black"/>
                    <path d="M1652.44 550C1695.58 550 1724.64 529.014 1731.46 496.683L1686.73 493.734C1681.84 507.006 1669.36 513.926 1653.23 513.926C1629.05 513.926 1613.73 497.931 1613.73 471.954V471.84H1732.48V458.568C1732.48 399.352 1696.6 370.085 1650.51 370.085C1599.2 370.085 1565.93 406.499 1565.93 460.269C1565.93 515.514 1598.74 550 1652.44 550ZM1613.73 441.892C1614.75 422.04 1629.85 406.159 1651.3 406.159C1672.31 406.159 1686.84 421.133 1686.95 441.892H1613.73Z" fill="black"/>
                    <path d="M1806.97 445.862C1807.08 423.401 1820.48 410.242 1840 410.242C1859.42 410.242 1871.11 422.948 1871 444.274V546.597H1919.36V435.653C1919.36 395.041 1895.52 370.085 1859.19 370.085C1833.31 370.085 1814.57 382.79 1806.74 403.096H1804.7V372.354H1758.6V546.597H1806.97V445.862Z" fill="black"/>
                    </svg>
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4" >
                        <li><NavLink exact to="/" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "17px"}} activeStyle = {{color: "black"}}>Home</NavLink></li>
                        <li><NavLink exact to="/discover" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "17px"}} activeStyle = {{color: "black"}}>Discover</NavLink></li>
                        <li><NavLink to="/create-campaign" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "17px"}} activeStyle={{color: 'black'}}>Start your campaign</NavLink></li>
                        <li><NavLink exact to="/user-dashboard" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "17px"}} activeStyle = {{color: "black"}}>Dashboard</NavLink></li>
                        <li><NavLink exact to="/layer-2" style = {{textDecoration: 'none', color: "#484344", fontFamily: "Jost", fontWeight: 700, fontSize: "17px"}} activeStyle = {{color: "black"}}>Layer2</NavLink></li>

                    </ul>
                    <div className="acc">
                        <a id = "value">Value</a>
                        <a id = "address" style = {{textOverflow: 'ellipsis', width: '220px', overflow: 'hidden', marginRight: '20px'}}></a>
                        <img className="profimg" src={profimg} width="20px" height="20px" />
                    </div>
                </div>
            </div>
        </nav>
    )
}