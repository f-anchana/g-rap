fetch('rapdata.json').then(function (response) {
    response.json().then(function () {


        d3.json("rapdata.json").then(function (data) {
            let couleur = ["black", "#5E504C", "#8A6E56"];
            let espaceEntreBarres = 1.4;
            let largeur_baton = 210 / data.length;


            d3.select("#objet")
                .selectAll("g")
                .data(data)
                .join("g")
                .attr("class", "histobarre")
                .attr("id", (d) => d.id)
                .attr("transform", (d, i) => `translate(${largeur_baton * i},0)`)


            d3.selectAll(".histobarre")
                .append("rect")
                .attr("width", `${largeur_baton - espaceEntreBarres}px`)
                .attr("height", (d) => d.Nbr * 100 / 2000000000)
                .attr("fill", (d, i) => couleur[i % couleur.length])
                .attr("transform", `scale(1,-1)`);


            // Fonction qui permet d'apporter des espaces dans les grands nombres en les transformant en string
            function formatNumberWithSpaces(number) {
                return number.toLocaleString();
            }
            

            
            let minY = 0;
            let maxY = 2000000000;
            let espace = 400000000;
            let chiffresClés = [];
            for (let i = minY; i <= maxY; i += espace) {
                chiffresClés.push(i);
            }
            let svg = d3.select("svg");
            let verticalSpacing = 20; // Ajustement de l'espacement vertical fixe entre les étiquettes


            svg.selectAll(".tiret")
                .data(chiffresClés)
                .enter()
                .append("line")
                .attr("class", ".tiret")
                .attr("x1", -3)
                .attr("y1", (d, i) => -(i * verticalSpacing))
                .attr("y2", (d, i) => -(i * verticalSpacing))
                .attr("stroke", "black")
                .attr("stroke-width", 0.2);


            svg.selectAll(".chiffresClés")
                .data(chiffresClés)
                .enter()
                .append("text")
                .attr("class", "chiffresClés")
                .attr("x", -8)
                .attr("y", (d, i) => -(i * verticalSpacing))
                .text((d) => formatNumberWithSpaces(d)) // Utilisez la fonction pour formater les nombres avec des espaces
                .attr("text-anchor", "end")
                .attr("font-size", "3px")
                .attr("fill", "black");



            // groupe pour les lignes représentant les années
            let anneesGroup = d3.select("#objet")
                .append("g")
                .attr("class", "annees");

            // Création des petits traits
            anneesGroup.selectAll("line")
                .data(data)
                .enter()
                .append("line")
                .attr("x1", (d, i) => largeur_baton * i + (largeur_baton - espaceEntreBarres) / 2)
                .attr("x2", (d, i) => largeur_baton * i + (largeur_baton - espaceEntreBarres) / 2)
                .attr("y1", 0.1)
                .attr("y2", 3)
                .attr("stroke", "black")
                .attr("stroke-width", 0.2);

            // Sélection de "year" à partir de rapdata.json
            anneesGroup.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("x", (d, i) => largeur_baton * i + (largeur_baton - espaceEntreBarres) / 2)
                .attr("y", 7)
                .text(d => d.year)
                .attr("text-anchor", "middle")
                .attr("font-size", "3px")
                .attr("fill", "black");



            // Effet selection barre
            let barreSelectionnee = null;

            d3.selectAll('.histobarre')
                .on("mouseenter", function (e, d) {
                    d3.selectAll('.histobarre').style("opacity", 0.5);
                    d3.select(this).style("opacity", 1).style("cursor", "pointer");
                     // Pour afficher les images miniatures quand on passe la souris au hover
                    d3.select("#image-miniature").attr("src", d.mini);
                    d3.select("#title").html(`${d.titre} by <span class='artista'> ${d.artiste} </span>`);
                    d3.select("#description").text(`${d.Nbr} streams on Spotify`);
                    d3.select("#description").text(formatNumberWithSpaces(d.Nbr) + " streams on Spotify");
                })
                .on("mouseleave", function (e, d) {
                    if (barreSelectionnee) {
                        d3.select(barreSelectionnee).style("opacity", 1);
                         // Pour faire disparaître l'image miniature et sa description lorsque la souris sort du bâton
                        d3.select("#image-miniature").attr("src", "");
                        d3.select("#description").text("");
                        d3.select("#title").text("");
                    } else {
                        d3.selectAll('.histobarre').style("opacity", 1);

                    }

                });







            let contenusection = d3.select("#section-3");
            d3.selectAll('.histobarre')
                .on("click", function (e, d) {
                    barreSelectionnee = this;
                    let sectionId = d.id;

                    // Suppression des anciennes sections de l'élément <div id="section-3">
                    contenusection.selectAll("section").remove();


                    d3.selectAll('.histobarre').style("opacity", 0.5);
                    d3.select(this).style("opacity", 1);

                    // Création d'une section avec l'id correspondant
                    const section = contenusection.append("section")
                        .attr("id", "section-" + sectionId);

                    // Remplissement de la section avec les données
                    section.html(`
                        <img src="${d.img}" class="image" alt="">
                        <img class="strokeright" src="./img/strokeright.png" alt="">
                        <img class="strokedown" src="./img/strokedown.png" alt="">
                        <div class="contenu">
                            <h1> Winner : ${d.year} </h1>
                            <h2 class="titre">${d.titre} by <span class="artista">${d.artiste}</span></h2>
                            <h3>Artist Biography :</h3>
                            <p class="bio">${d["content-artist"]}</p>
                            <h3>About the Hit :</h3>
                            <p class="bio">${d["content-titre"]}</p>
                            ${d.frame}
                        </div>
                    `);

                    // Affichage de la section
                    section.style("display", "block");

                    let sectionElement = section.node();
                    sectionElement.scrollIntoView({ behavior: "smooth" });
                });

        });

    });

    // Popup
    var popup = document.querySelector('.popup-visible');
    var btnMentions = document.querySelector('.mentions-légale p');
    btnMentions.addEventListener('click', function () {
        popup.style.display = 'block';
    });
    var fermer = document.querySelector('.fermer');
    fermer.addEventListener('click', function () {
        popup.style.display = 'none';
    });
})
