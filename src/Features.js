import { interpolateWarm } from 'd3-scale-chromatic'
import { rgb, hsl, color } from 'd3-color';

class Features {
    constructor() {

        //color temp 
        this.color = {
            tag: "",
            value: 0.5
        };
        this.setColor();

        //environment
        this.env = {
            tag: "",
            img: {}
        }

        //drives how many points in the convex hull geometry
        this.density = {
            tag: "",
            value: ""
        }
        this.setDensity();
    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2){
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    setColor(){
        let c = fxrand();
        if( c < 0.43 ) this.color.tag = "Cool";
        else if ( c < 0.73 ) this.color.tag = "Nice";
        else this.color.tag = "Hot";

        this.color.value = rgb(interpolateWarm(c));
    }



    setDensity(){
        let d = fxrand();
        this.density.value = this.map(d, 0, 1, 25, 150);

        if( d < 0.35 ) this.density.tag = "Low";
        else if ( d < 0.8 ) this.density.tag = "Medium";
        else this.density.tag = "Dense";
    }
}

export {Features}