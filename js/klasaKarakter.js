// spojiti sve funkcije za crtanje u jednu ako je moguce

function Karakter(ime, slika_src, scena, vreme){
	var ovaj_karakter = this;
    this.ime = ime.VelikoSlovo();
	this.slika = new Image();
    this.slika.src = slika_src;

    this.STANDARDNA_VISINA = 118;
    this.slika = _prilagodiSliku(this, this.slika);
    this.sirina = this.slika.width;
    this.visina = this.slika.height;
    this.x = -100;         // dodeljuje slucajnaPozicija
    this.y = -100;
	this.zapamcen_y = 0;
	this.zapamcen_x = 0;
	this.zapamcena_visina = this.visina;
	this.zapamcena_sirina = this.sirina;

    this.igra = false;
    this.kukanje = false;
    this.dizanje = false;
	this.mrdanje_desno = false;
    this.spustenost = 0;
	this.pomerenost_ulevo = 0;
	this.pokret_levo_desno = false;
	this.pokret_gore_dole = false;
	

	/*************** FUNKCIJE ***************/

	this.ulazi = function(trenutak_ulaska) {
		if(vreme.preostalo <= trenutak_ulaska) {
		this.igra = true;
		}
	}	// kraj ulazi

    this.slucajnaPozicija = function(pozicije) {
		var slucajno = Math.floor (Math.random() * pozicije.length);		
        this.x = pozicije[slucajno][0];
        this.y = pozicije[slucajno][1];
    }   // kraj slucajnaPozicija

    this.crtaj = function() {
		if (this.x >= 0 && this.y >= 0) {
			scena.sadrzaj.drawImage(this.slika, this.x, this.y, this.sirina, this.visina);
		}
	}   // kraj crtaj

    this.crtajDizanje = function() {
		if (this.x >= 0 && this.y >= 0) {
			scena.sadrzaj.drawImage(this.slika, 0, 0, this.slika.naturalWidth, this.slika.naturalHeight - this.spustenost * (this.slika.naturalHeight/this.slika.height), this.x, this.y, this.sirina, this.visina)			
		} 
    }   // kraj crtajDizanje

    this.crtajUlazSleva = function() {
        var slika = this.slika;
        var izvor_x = 0 + this.pomerenost_ulevo * (this.slika.naturalWidth/this.slika.width);
        var izvor_y = 0;
        var izvor_sirina = this.slika.naturalWidth - this.pomerenost_ulevo * (this.slika.naturalWidth/this.slika.width);
        var izvor_visina = this.slika.naturalHeight;
        var platno_x = this.x + this.pomerenost_ulevo;
        var platno_y = this.y;
        var na_platnu_sirina = this.sirina - this.pomerenost_ulevo;
        var na_platnu_visina = this.visina;

        if (this.x >= 0 && this.y >= 0) {
            scena.sadrzaj.drawImage(slika, izvor_x, izvor_y, izvor_sirina, izvor_visina, platno_x, platno_y, na_platnu_sirina, na_platnu_visina);
        }
    }   // kraj crtajUlazSleva

    this.UlaziSLeva = function(){
        this.pokret_levo_desno = true;
        if(this.pomerenost_ulevo >= 30) {
            this.mrdanje_desno = true;
        }
        if (this.pomerenost_ulevo <= 0) {
            this.mrdanje_desno = false;
        }
        this.mrdanje_desno ? this.mrdajDesno() : this.mrdajLevo();
        this.x = this.zapamcen_x - this.pomerenost_ulevo;
        //this.sirina = this.zapamcena_sirina - this.pomerenost_ulevo;
    }

	this.mrdajDesno = function(){
		this.pomerenost_ulevo -= 0.5;
	}
	
	this.mrdajLevo = function(){
		this.pomerenost_ulevo += 0.5;
	}

    this.proviruje = function(){
        if(this.spustenost >= 30) {
            this.dizanje = true;
        }
        if (this.spustenost <= 0) {
            this.dizanje = false;
        }
        this.dizanje ? this.dizi() : this.spustaj();
        this.y = this.zapamcen_y + this.spustenost;
        this.visina = this.zapamcena_visina - this.spustenost;
    }	// kraj proviruje

    this.dizi = function(){
		this.spustenost--
	}	// kraj dizi
	    
    this.spustaj = function(){
		this.spustenost++
	}	// kraj spustaj

    this.sudar = function(karakter){
        if(this.x == karakter.x && this.y == karakter.y){
            return true;
        } else return false;
    }   // kraj sudar

    this.proveriSveSudare = function (karakteri) {
        var sudari = false;        
        for (var i = 0; i < karakteri.length; i++) {
			if( i == karakteri.indexOf(this) ) continue;		// preskoci sebe
            sudari = sudari || this.sudar(karakteri[i]);
        }  // kraj petlje
		return sudari;
    }   // kraj proveriSveSudare

    this.nadjiSlobodnoMesto = function (karakteri) {
        this.slucajnaPozicija(scena.pozicije);
        while ( this.proveriSveSudare(karakteri) ) {
            this.slucajnaPozicija(scena.pozicije);
        }
    }   // kraj naSlobodnomCrtaj

    this.kuka = function(mish){
        var kuknjava = this.kuknjava || "Jaoj, to boli!";
        scena.sadrzaj.font = "30px Verdana";
        scena.sadrzaj.lineWidth = 1;
        scena.sadrzaj.fillText(kuknjava, mish.x+30, mish.y, 250);           // poslednji argument je maksimalna shirina teksta
        scena.sadrzaj.strokeText(kuknjava, mish.x+30, mish.y, 250);
    }   // kraj kuka

	this.bacaParole = function(){
        var parola = this.parola || "Mi branimo srpski narod!";
		// bacaParole koje ti skidaju energiju
    }   // kraj bacaParole

    function _prilagodiSliku(ovaj_karakter, slika){
        // prilagodjava sliku standardnoj visini slike
        var nova_sirina = slika.width / (slika.height / ovaj_karakter.STANDARDNA_VISINA);
        var nova_visina = ovaj_karakter.STANDARDNA_VISINA;
        // prilagodjava sliku ovom ekranu
        slika.width = nova_sirina * (window.innerWidth / scena.STANDARDNA_SIRINA);
        slika.height = nova_visina * (window.innerWidth / scena.STANDARDNA_SIRINA);
        return slika;
    }


}   // kraj Karakter
