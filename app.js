const PLAYLIST_URL =
"https://livecdn.euw1-0005.jwplive.com/live/sites/fM9jRrkn/media/KNoZm1zY/live.isml/.m3u8";

const video =
document.getElementById("video");

const channelList =
document.getElementById("channelList");

const search =
document.getElementById("search");

const channelTitle =
document.getElementById("channelTitle");

let channels = [];
let hls;

async function loadPlaylist(){

    try{

        const res =
        await fetch(PLAYLIST_URL);

        const text =
        await res.text();

        parsePlaylist(text);

    }catch(err){

        console.error(err);

        channelTitle.innerText =
        "Playlist gagal dimuat";

    }

}

function parsePlaylist(data){

    const lines =
    data.split("\n");

    let currentName = "";

    channels = [];

    lines.forEach(line=>{

        line = line.trim();

        if(line.startsWith("#EXTINF")){

            currentName =
            line.split(",").pop();

        }

        if(line.startsWith("http")){

            channels.push({
                name: currentName,
                url: line
            });

        }

    });

    renderChannels(channels);

    if(channels.length){

        playChannel(channels[0]);

    }

}

function renderChannels(list){

    channelList.innerHTML="";

    list.forEach(channel=>{

        const div =
        document.createElement("div");

        div.className="channel";

        div.innerText =
        channel.name;

        div.onclick=()=>{

            document
            .querySelectorAll(".channel")
            .forEach(x=>
                x.classList.remove("active")
            );

            div.classList.add("active");

            playChannel(channel);

        };

        channelList.appendChild(div);

    });

}

function playChannel(channel){

    channelTitle.innerText =
    channel.name;

    if(hls){

        hls.destroy();

    }

    if(Hls.isSupported()){

        hls = new Hls();

        hls.loadSource(channel.url);

        hls.attachMedia(video);

        hls.on(
            Hls.Events.MANIFEST_PARSED,
            ()=>{
                video.play().catch(()=>{});
            }
        );

    }else{

        video.src = channel.url;

    }

}

search.addEventListener("input",()=>{

    const keyword =
    search.value.toLowerCase();

    const filtered =
    channels.filter(c=>
        c.name.toLowerCase()
        .includes(keyword)
    );

    renderChannels(filtered);

});

loadPlaylist();
