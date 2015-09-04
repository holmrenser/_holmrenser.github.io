---
layout: post
title: About
permalink: /about/
---

On this site I visualize the evolutionary history of plant genes involved in the symbiosis between legumes and rhizobium bacteria. More specifically, I use the *gene families* of these genes in 21 selected Angiosperms (For a full list of used plant species see bottom).  

I combine phylogenetic trees of the gene families with information on the synteny of the family's genes. 

Two genes are said to share synteny when they are found on the same location on the chromosome. Things like whole genome duplications, transpositions or tandem duplications can break up shared synteny, and are an important driver of evolution.

By taking a network approach I am able to identify clusters of genes that share synteny between multiple species. By combining these syntenic gene-clusters with phylogenetic information I can show that genes that are conserved on the nucleotide level are generally also conserved in their genomic position.

More importantly I can identify events like ancient transpositions or duplications. In the context of rhizobium symbiosis: if I find a clade of legume genes that share synteny *only with other legume genes*, this is evidence for a transposition of the ancestral gene at the origin of the legumes. Such genes are interesting candidates for further studies.

Apart from searching for candidate genes, this site is a useful tool for visualizing large gene families because of its interactive nature.

###Data sources

* For the gene family identification I use data from [PLAZA][1]  
* For the Synteny information I use data from [PGDD][2]  

###Tools:
For visualization this site relies heavily on [D3.js][3]. Content management is done with [Jekyll][4]. [jQuery][5] and [Bootstrap][6] make my life easy in terms of javascript and css resepectively.
The actual data processing is done offline with a python script that wraps several other tools: [MCL][7] for network clustering, [mafft][8] for multiple sequence alignment and [FastTree][9] for phylogenetic reconstruction.

###Wishlist

* An algorithm to identify orthologs, paralogs, duplication, speciation and translocation. All of this while taking into account the species tree.  
* A database to be able to scale to genome-wide studies.  
* Expand the taxon sampling (This would require the identification of gene families and synteny from scratch, which takes a lot of time)  
* Pre-render most visualization to improve load-time  
* A search function  
* Blast your favourite gene to the database  
* All of the above will probably lead to an implementation in [node.js][10]

###Taxon sampling


| Species | Family | Order | rhizobium symbiosis |
| ------- | ------ | ----- | :---: | 
| Amborella trichopoda | Amborellaceae | Magnoliales | No | 
| Arabidopsis thaliana | Brassicaceae | Brassicales | No | 
| Arabidopsis lyrata | Brassicaceae | Brassicales | No | 
| Brassica rapa | Brassicaceae | Brassicales | No | 
| Carica papaya | Caricaceae | Brassicales | No |
| Chlamydomonas reinhardtii | Chlamydomonadaceae | Chlamydomonadales | No |
| Fragaria vesca | Rosaceae | Rosales | No |
| Glycine max | Fabaceae | Fabales | Yes |
| Gossipium raimondii | Malvaceae | Malvales | No |
| Lotus japonicum | Fabaceae | Fabales | Yes |
| Medicago truncatula | Fabaceae | Fabales | Yes |
| Oryza sativa | Poaceae | Poales | No |
| Phaseolus vulgaris | Fabaceae | Fabales | Yes |
| Populus trichocarpa | Salicaceae | Malpighiales | No |
| Ricinus communis | Euphorbiaceae | Malpighiales | No |
| Solanum lycopersicum | Solanaceae | Solanales | No |
| Solanum tuberosum | Solanaceae | Solanales | No |
| Theobroma cacao | Malvaceae | Malvales | No |
| Zea mays | Poaceae | Poales | No |


[1]: http://http://plaza.psb.ugent.be/
[2]: http://chibba.agtec.uga.edu/duplication/
[3]: http://http://d3js.org/
[4]: http://jekyllrb.com/
[5]: http://jquery.com/
[6]: http://http://getbootstrap.com/
[7]: http://micans.org/mcl/index.html
[8]: http://mafft.cbrc.jp/alignment/software/
[9]: http://www.microbesonline.org/fasttree/
[10]: http://nodejs.org/


