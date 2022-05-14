function Magazines(magazinesRoot) {
    let
        index=0,
        magazines={},
        cache={};

    let
        getFromCache=(file,cb)=>{
            if (cache[file])
                cb(cache[file]);
            else
                Tools.download(file,(text)=>{
                    cache[file]=text;
                    cb(text);
                })
        }
        getMagazine=(id,cb)=>{
            if (magazines[id])
                cb(magazines[id]);
            else
                Tools.download(magazinesRoot+"/"+id+"/index.json",(text)=>{
                    let magazine=JSON.parse(text);
                    magazines[id]=magazine;
                    for (let i=0;i<magazine.pages.length;i++)
                        if (magazine.pages[i].type == "toc") {
                            magazine.tocPage = i;
                            break;
                        }
                    cb(magazine);
                });
        },
        renderPage=(id,magazine,pagenumber,cb)=>{
            let
                page=magazine.pages[pagenumber];
            if (page)
                switch (page.type) {
                    case "cover":{
                        let body="";
                        page.elements.forEach(element=>{
                            if (element.text)
                                body+="<div class='magazinecover "+element.type+"'"+(element.style?" style=\""+element.style+"\"":"")+">"+element.text+"</div>";
                        });
                        cb({
                            pageType:"cover",
                            pageStyle:page.style,
                            magazine:magazine,
                            body:body
                        });
                        break;
                    }
                    case "firstpage":{
                        let body="";
                        body+="<div class='magazinetitle'>"+Tools.htmlEntities(page.title)+"</div>";
                        if (page.subtitle) body+="<div class='magazinesubtitle'>"+Tools.htmlEntities(page.subtitle)+"</div>";
                        if (page.article) {
                            body+="<div class='magazinearticle'>";
                            page.article.forEach(paragraph=>body+="<p>"+paragraph+"</p>");
                            if (page.author) body+="<p>&dash; "+page.author+"</p>";
                            body+="</div>";
                        }
                        if (page.references) {
                            body+="<div class='magazinereferences'><ul>";
                            page.references.forEach(reference=>{
                                body+="<li>"+Tools.htmlEntities(reference.description)+(reference.url ? " (<a target='_blank' href='"+reference.url+"'>Link</a>)" : "")+"</li>"
                            });
                            body+="</div>";
                        }
                        cb({
                            pageType:"normal",
                            pageStyle:"",
                            magazine:magazine,
                            body:body
                        });
                        break;
                    }
                    case "toc":{
                        let body="";
                        body+="<h1>"+Tools.htmlEntities(page.title)+"</h1><div class='toc'>";
                        magazine.pages.forEach((page,id)=>{
                            body+="<div class='tocitem'><div class='pagenum'>Pg."+(id+1)+"</div><div class='pagetitle' magazine-gotopage='"+id+"'>"+page.title+"</div></div>";
                        });
                        body+="</div>";
                        cb({
                            pageType:"normal",
                            pageStyle:"",
                            magazine:magazine,
                            body:body
                        });
                        break;
                    }
                    case "source":{
                        getFromCache(magazinesRoot+"/"+id+"/"+magazine.sourcesRoot+"/"+page.source,(source)=>{
                            let
                                body = "",
                                article = "",
                                codelines=source.split("\n"),
                                sourcesFont = page.sourcesFont||magazine.sourcesFont,
                                sourcesPackage = page.sourcesPackages||magazine.sourcesPackages;
                            body += "<h1>"+Tools.htmlEntities(page.title)+"</h1>";
                            if (page.author) article+="<div class='author'>"+Tools.htmlEntities(page.author)+"</div>";
                            if (page.article)
                                page.article.forEach(paragraph=>article+="<p>"+paragraph+"</p>");
                            if (article)
                                body+="<div class='article "+(!page.singleColumn && (article.length>500)?"long":"")+"'>"+article+"</div>";
                            body +="<div class=\"sourcesbar\">";
                            if (page.url) body+="<a class=\"learnmorebutton\" target=\"_blank\" href=\""+page.url+"\">Read more...</a>";
                            body+="<div class=\"typeinbutton\" magazine-typein=\"true\">Auto type-in this program</div>";
                            body+="</div>";
                            body += "<div class=\"sources\""+(sourcesFont?" style=\"font-family:"+sourcesFont+"\"":"")+">";
                            codelines.forEach(line=>{
                                line=Tools.htmlEntities(line).replace(/ /g,"&nbsp;").trimEnd();
                                body+="<div class=\"line\">"+(line||"&nbsp;")+"</div>";
                            });
                            body += "</div>";
                            cb({
                                pageType:"normal",
                                pageStyle:"",
                                magazine:magazine,
                                body:body,
                                program:{
                                    title:page.title,
                                    sources:source+( sourcesPackage ? "\n\n// [Programmino:"+sourcesPackage+"]" : "" )
                                }
                            });
                        });
                        break;
                    }
                }
            else
                cb({
                    pageType:"normal",
                    magazine:magazine
                });
        };

    this.getPage=function(id,page,cb) {
        getMagazine(id,(magazine)=>{
            renderPage(id,magazine,page,cb)
        })
    },
    this.getIndex=function(cb) {
        if (index) cb(index);
        else {
            Tools.download(magazinesRoot+"/index.json",(text)=>{
                index=JSON.parse(text);
                cb(index);
            })
        }
    }
};