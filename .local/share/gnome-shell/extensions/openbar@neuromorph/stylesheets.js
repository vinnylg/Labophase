/* stylesheets.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * author: neuromorph
 */

/* exported reloadStyle() saveGtkCss() saveFlatpakOverrides() */

const {Gio, Pango, GLib} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;

const colorMix = Utils.colorMix;
const colorBlend = Utils.colorBlend;
const colorShade = Utils.colorShade;
const getHSP = Utils.getHSP;
const getBgDark = Utils.getBgDark;
const rgbToHex = Utils.rgbToHex;

// SVG for calendar event dot icon (use fg color)
function saveCalEventSVG(obar, Me) {
    let svg, svgpath, svgcolor;
    svg = `
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <circle style="color:#000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;
    mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000;solid-opacity:1;
    fill:#REPLACE;fill-opacity:.858;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;
    stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;marker:none;marker-start:none;marker-mid:none;
    marker-end:none;paint-order:normal;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate" cx="16" cy="28" r="2"/>
    </svg>
    `;
    svgpath = Me.path + '/media/calendar-today.svg';
    svgcolor = obar.smfgHex;
    
    svg = svg.replace(`#REPLACE`, svgcolor);
   
    let file = Gio.File.new_for_path(svgpath);
    let bytearray = new TextEncoder().encode(svg);

    if (bytearray.length) {
        let output = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let outputStream = Gio.BufferedOutputStream.new_sized(output, 4096);
        outputStream.write_all(bytearray, null);
        outputStream.close(null);
    }
    else {
      console.log("Failed to write calendar-today.svg file: " + svgpath);
    }

}

// SVG for toggle switch (toggle On)
function saveToggleSVG(type, obar, Me) {
    let svg, svgpath, svgFill = '', svgStroke = '', hc = '';    
    svg =
    `<svg viewBox="0 0 44 26" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect y="4" width="44" height="18" rx="9" ry="9" style="fill:#SVGFILL;stroke:none;stroke-width:1;marker:none"/>
            <rect x="22" y="2" width="22" height="22" rx="11" ry="11" fill="#f8f7f7"/>
        </g>
        #HIGHCONTRAST
    </svg>`;

    svgFill = obar.msHex;
    svg = svg.replace(`#SVGFILL`, svgFill);
    svgpath = Me.path + '/media/toggle-on.svg';
    if(type == 'on-hc') {
        svgpath = Me.path + '/media/toggle-on-hc.svg';
        hc = `<path style="fill:#f8f7f7;fill-opacity:1;stroke:none;stroke-width:2;stroke-linejoin:round;stroke-dashoffset:2" d="M16 8v10h-2V8Z"/>`;
    }
    svg = svg.replace(`#HIGHCONTRAST`, hc);
   
    let file = Gio.File.new_for_path(svgpath);
    let bytearray = new TextEncoder().encode(svg);

    if (bytearray.length) {
        let output = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let outputStream = Gio.BufferedOutputStream.new_sized(output, 4096);
        outputStream.write_all(bytearray, null);
        outputStream.close(null);
    }
    else {
      console.log("Failed to write toggle-on.svg file: " + svgpath);
    }

}

// SVG for checkbox buttons (On, On-focused, Off-focused)
function saveCheckboxSVG(type, obar, Me) {
    let svg, svgpath, svgFill = 'none', svgStroke = 'none';
    if(type == 'on') {
        svg = `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#SVGFILL" stroke="#SVGSTROKE" stroke-linejoin="round" style="stroke-width:1"/>
            <path d="m20.16 7.527-1.253-1.414-.118.104-8.478 7.426-4.97-4.263-1.503 1.699 6.474 6.811z" fill="#fff" fill-rule="evenodd"/>
        </svg>
        `;

        svgpath = Me.path + '/media/checkbox-on.svg';
        svgFill = obar.msHex;
        svgStroke = obar.msHex;
    }
    else if(type == 'on-focused'){
        svg = `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#SVGFILL" stroke="#SVGSTROKE" stroke-linejoin="round"/>
            <path d="m20.16 7.527-1.253-1.414-.118.104-8.478 7.426-4.97-4.263-1.503 1.699 6.474 6.811z" fill="#fff" fill-rule="evenodd"/>
        </svg>
        `;

        svgpath = Me.path + '/media/checkbox-on-focused.svg';
        svgFill = obar.msHex;
        svgStroke = obar.mhHex;
    }
    else if(type == 'off-focused'){
        svg = `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#SVGFILL" stroke="#SVGSTROKE" stroke-linejoin="round"/>
        </svg>
        `;

        svgpath = Me.path + '/media/checkbox-off-focused.svg';
        svgFill = '#aaa';
        svgStroke = obar.mhHex;
    }
    
    svg = svg.replace(`#SVGFILL`, svgFill);
    svg = svg.replace(`#SVGSTROKE`, svgStroke);
   
    let file = Gio.File.new_for_path(svgpath);
    let bytearray = new TextEncoder().encode(svg);

    if (bytearray.length) {
        let output = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let outputStream = Gio.BufferedOutputStream.new_sized(output, 4096);
        outputStream.write_all(bytearray, null);
        outputStream.close(null);
    }
    else {
      console.log("Failed to write checkbox-on/off.svg file: " + svgpath);
    }

}

// Create Gtk Stylesheet string
function createGtkCss(obar) {
    // Add hint of Accent color to Headerbar and Sidebar
    let hBarHint = obar._settings.get_int('headerbar-hint')/100;
    let sBarHint = obar._settings.get_int('sidebar-hint')/100;
    let cdHint = obar._settings.get_int('card-hint')/100;
    let hBarHintBd = hBarHint/2;
    let sBarHintBd = sBarHint/2;
    let cdHintBd = cdHint/2;
    let sBarTransparency = obar._settings.get_boolean('sidebar-transparency');
    let trafficLightButtons = obar._settings.get_boolean('traffic-light');
    let popoverMenu = obar._settings.get_boolean('gtk-popover');
    let winBAlpha = obar._settings.get_double('winbalpha');
    let winBWidth = obar._settings.get_double('winbwidth');
    let winBColor = obar._settings.get_strv('winbcolor');
    const winBRed = parseInt(parseFloat(winBColor[0]) * 255);
    const winBGreen = parseInt(parseFloat(winBColor[1]) * 255);
    const winBBlue = parseInt(parseFloat(winBColor[2]) * 255);
    let accent = obar._settings.get_strv('mscolor');
    const accRed = parseInt(parseFloat(accent[0]) * 255);
    const accGreen = parseInt(parseFloat(accent[1]) * 255);
    const accBlue = parseInt(parseFloat(accent[2]) * 255);
    let mbgAlpha = obar._settings.get_double('mbgalpha');
    let mbgColor = obar._settings.get_strv('mbgcolor');
    const mbgRed = parseInt(parseFloat(mbgColor[0]) * 255);
    const mbgGreen = parseInt(parseFloat(mbgColor[1]) * 255);
    const mbgBlue = parseInt(parseFloat(mbgColor[2]) * 255);
    
    let bgRed, bgGreen, bgBlue, cdRed, cdGreen, cdBlue, hbRed, hbGreen, hbBlue, hbcRed, hbcGreen, hbcBlue;
    const colorScheme = obar._intSettings.get_string('color-scheme');
    if(colorScheme == 'prefer-dark') {
        bgRed = bgGreen = bgBlue = 30; // Headerbar/Sidebar BG
        cdRed = cdGreen = cdBlue = 61; // Card/Dialog BG
        hbRed = hbGreen = hbBlue = 55; // Headerbar button BG
        hbcRed = hbcGreen = hbcBlue = 15; // Headerbar Checked toggle button BG
    }
    else {
        bgRed = bgGreen = bgBlue = 235;
        cdRed = cdGreen = cdBlue = 255;
        hbRed = hbGreen = hbBlue = 255;
        hbcRed = hbcGreen = hbcBlue = 215;
    }
    
    // Headerbar BG and Backdrop
    const hbgRed = hBarHint * accRed + (1-hBarHint) * bgRed;
    const hbgGreen = hBarHint * accGreen + (1-hBarHint) * bgGreen;
    const hbgBlue = hBarHint * accBlue + (1-hBarHint) * bgBlue;
    const hbdRed = hBarHintBd * accRed + (1-hBarHintBd) * bgRed;
    const hbdGreen = hBarHintBd * accGreen + (1-hBarHintBd) * bgGreen;
    const hbdBlue = hBarHintBd * accBlue + (1-hBarHintBd) * bgBlue;
    // Sidebar BG and Backdrop
    const sbgRed = sBarHint * accRed + (1-sBarHint) * bgRed;
    const sbgGreen = sBarHint * accGreen + (1-sBarHint) * bgGreen;
    const sbgBlue = sBarHint * accBlue + (1-sBarHint) * bgBlue;
    const sbdRed = sBarHintBd * accRed + (1-sBarHintBd) * bgRed;
    const sbdGreen = sBarHintBd * accGreen + (1-sBarHintBd) * bgGreen;
    const sbdBlue = sBarHintBd * accBlue + (1-sBarHintBd) * bgBlue;
    // Sidebar Alpha
    const sbAlpha = sBarTransparency? 0.5 : 1.0;
    // Card/Dialog BG and Backdrop
    const cbgRed = cdHint * accRed + (1-cdHint) * cdRed;
    const cbgGreen = cdHint * accGreen + (1-cdHint) * cdGreen;
    const cbgBlue = cdHint * accBlue + (1-cdHint) * cdBlue;
    const cbdRed = cdHintBd * accRed + (1-cdHintBd) * cdRed;
    const cbdGreen = cdHintBd * accGreen + (1-cdHintBd) * cdGreen;
    const cbdBlue = cdHintBd * accBlue + (1-cdHintBd) * cdBlue;
    // Headerbar Buttons BG and Backdrop
    const hbbgRed = hBarHint * accRed + (1-hBarHint) * hbRed;
    const hbbgGreen = hBarHint * accGreen + (1-hBarHint) * hbGreen;
    const hbbgBlue = hBarHint * accBlue + (1-hBarHint) * hbBlue;
    const hbbdRed = hBarHintBd * accRed + (1-hBarHintBd) * hbRed;
    const hbbdGreen = hBarHintBd * accGreen + (1-hBarHintBd) * hbGreen;
    const hbbdBlue = hBarHintBd * accBlue + (1-hBarHintBd) * hbBlue;
    // Headerbar Checked Toggle Buttons BG
    const hbcbgRed = hBarHint * accRed + (1-hBarHint) * hbcRed;
    const hbcbgGreen = hBarHint * accGreen + (1-hBarHint) * hbcGreen;
    const hbcbgBlue = hBarHint * accBlue + (1-hBarHint) * hbcBlue;
    // Headerbar Buttons BG:Hover
    let hbhRed, hbhGreen, hbhBlue, acchRed, acchGreen, acchBlue, hbBordRed, hbBordGreen, hbBordBlue;
    if(getBgDark(hbgRed, hbgGreen, hbgBlue)) {
        hbhRed = hbbgRed + (255 - hbbgRed) * 0.07;
        hbhGreen = hbbgGreen + (255 - hbbgGreen) * 0.07;
        hbhBlue = hbbgBlue + (255 - hbbgBlue) * 0.07;

        acchRed = accRed + (255 - accRed) * 0.07;
        acchGreen = accGreen + (255 - accGreen) * 0.07;
        acchBlue = accBlue + (255 - accBlue) * 0.07;
    }
    else {
        hbhRed = hbbgRed - hbbgRed * 0.07;
        hbhGreen = hbbgGreen - hbbgGreen * 0.07;
        hbhBlue = hbbgBlue - hbbgBlue * 0.07;

        acchRed = accRed - accRed * 0.07;
        acchGreen = accGreen - accGreen * 0.07;
        acchBlue = accBlue - accBlue * 0.07;
    }
    
    // Window Border
    const winBRedBd = 0.6 * winBRed + 0.4 * bgRed;
    const winBGreenBd = 0.6 * winBGreen + 0.4 * bgGreen;
    const winBBlueBd = 0.6 * winBBlue + 0.4 * bgBlue;

    let hfgRed, hfgGreen, hfgBlue;
    if(getBgDark(hbgRed, hbgGreen, hbgBlue))
        hfgRed = hfgGreen = hfgBlue = 255;
    else
        hfgRed = hfgGreen = hfgBlue = 20;

    let sfgRed, sfgGreen, sfgBlue;
    if(getBgDark(sbgRed, sbgGreen, sbgBlue))
        sfgRed = sfgGreen = sfgBlue = 255;
    else
        sfgRed = sfgGreen = sfgBlue = 20;
        
    let afgRed, afgGreen, afgBlue;
    if(getBgDark(accRed, accGreen, accBlue))
        afgRed = afgGreen = afgBlue = 255;
    else
        afgRed = afgGreen = afgBlue = 20;
        
    let mfgRed, mfgGreen, mfgBlue;
    if(getBgDark(mbgRed, mbgGreen, mbgBlue))
        mfgRed = mfgGreen = mfgBlue = 255;
    else
        mfgRed = mfgGreen = mfgBlue = 20;
    
    let cfgRed, cfgGreen, cfgBlue;
    if(getBgDark(cbgRed, cbgGreen, cbgBlue))
        cfgRed = cfgGreen = cfgBlue = 255;
    else
        cfgRed = cfgGreen = cfgBlue = 20;

    
    let gtkstring = `
    /*** Open Bar GTK CSS ***/
    /* This file is autogenerated. Do not edit. */

    @define-color accent_color rgba(${accRed}, ${accGreen}, ${accBlue}, 1.0);
    @define-color accent_bg_color rgba(${accRed}, ${accGreen}, ${accBlue}, 0.85);
    @define-color accent_fg_color rgba(${afgRed}, ${afgGreen}, ${afgBlue}, 0.9);
    
    link {
        color: @accent_bg_color;
    }
    link:hover {
        color: @accent_color;
    }

    /* Toggle Switch */ 
    switch {
        padding: 0px 3px;
    }    
    switch > slider {
        min-width: 20px;
        min-height: 20px;
        margin: -2px 0px -2px -4px;
    }
    switch:checked > slider {
        margin: -2px -4px -2px 0px;
    }

    /* Window Border */
    window,
    decoration,
    decoration-overlay {
        border: ${winBWidth}px solid rgba(${winBRed}, ${winBGreen}, ${winBBlue}, ${winBAlpha});
    }
    window:backdrop,
    decoration:backdrop,
    decoration-overlay:backdrop {
        border: ${winBWidth}px solid rgba(${winBRedBd}, ${winBGreenBd}, ${winBBlueBd}, ${winBAlpha});
    }
    window.maximized,
    window.maximized > decoration,
    window.maximized > decoration-overlay,
    tooltip > decoration, tooltip > decoration-overlay {    
        border: none;
        /*border-radius: 0px;*/
    }
    /*window, 
    decoration,
    decoration-overlay {
        border-radius: 20px;
    }*/
    `;
    
    if(hBarHint) {
        gtkstring += `
        @define-color headerbar_bg_color rgb(${hbgRed}, ${hbgGreen}, ${hbgBlue});
        @define-color headerbar_backdrop_color rgb(${hbdRed}, ${hbdGreen}, ${hbdBlue});
        @define-color headerbar_fg_color rgba(${hfgRed}, ${hfgGreen}, ${hfgBlue}, 0.9);
    
        headerbar, 
        .top-bar,
        .titlebar { 
            background-color: @headerbar_bg_color;
            background-image:none;
        } 
        headerbar:backdrop,
        .top-bar:backdrop,
        .titlebar:backdrop { 
            background-color: @headerbar_backdrop_color;
        }

        headerbar > label, headerbar > box > label {
            color: @headerbar_fg_color;
        }        
        headerbar > button,
        headerbar > box > button, headerbar > box > box > button,
        headerbar > entry,
        headerbar > box > entry {
            background-image: image(rgb(${hbbgRed}, ${hbbgGreen}, ${hbbgBlue}));
            color: @headerbar_fg_color;
            border-color: alpha(@headerbar_fg_color, 0.2);
        }
        headerbar:backdrop > button,
        headerbar:backdrop > box > button, headerbar:backdrop > box > box > button,
        headerbar:backdrop > entry,
        headerbar:backdrop > box > entry {
            background-image: image(rgb(${hbbdRed}, ${hbbdGreen}, ${hbbdBlue}));
            color: rgba(${hfgRed}, ${hfgGreen}, ${hfgBlue}, 0.65);
        }
        headerbar > button:disabled,
        headerbar > box > button:disabled, headerbar > box > box > button:disabled,
        headerbar > entry:disabled,
        headerbar > box > entry:disabled {
            background-image: image(rgba(0,0,0,0));
            color: alpha(@headerbar_fg_color, 0.5);
        }
        headerbar > button:hover,
        headerbar > box > button:hover, headerbar > box > box > button:hover,
        headerbar > entry:hover,
        headerbar > box > entry:hover {
            background-image: image(rgb(${hbhRed}, ${hbhGreen}, ${hbhBlue}));
            border-color: alpha(@headerbar_fg_color, 0.3);
        }
        headerbar > button:checked,
        headerbar > box > button:checked, headerbar > box > box > button:checked {
            background-image: image(rgb(${hbcbgRed}, ${hbcbgGreen}, ${hbcbgBlue}));
            border-color: alpha(@headerbar_fg_color, 0.3);
        }
        headerbar > button.suggested-action,
        headerbar > box > button.suggested-action, headerbar > box > box > button.suggested-action {
            background-image: image(@accent_bg_color);
            color: @accent_fg_color;
        }
        headerbar > button.suggested-action:hover,
        headerbar > box > button.suggested-action:hover, headerbar > box > box > button.suggested-action:hover {
            background-image: image(rgba(${acchRed}, ${acchGreen}, ${acchBlue}, 0.85));
            color: rgba(${afgRed}, ${afgGreen}, ${afgBlue}, 0.95);
        }
        
        `;
    }
    
    if(sBarHint) {
        gtkstring += `
        @define-color sidebar_bg_color rgba(${sbgRed}, ${sbgGreen}, ${sbgBlue}, ${sbAlpha});
        @define-color sidebar_backdrop_color rgba(${sbdRed}, ${sbdGreen}, ${sbdBlue}, ${sbAlpha});
        @define-color sidebar_fg_color rgba(${sfgRed}, ${sfgGreen}, ${sfgBlue}, 0.9);

        @define-color secondary_sidebar_bg_color rgba(${sbgRed}, ${sbgGreen}, ${sbgBlue}, ${0.9*sbAlpha});
        @define-color secondary_sidebar_backdrop_color rgba(${sbdRed}, ${sbdGreen}, ${sbdBlue}, ${0.9*sbAlpha});    
        @define-color secondary_sidebar_fg_color rgba(${sfgRed}, ${sfgGreen}, ${sfgBlue}, 0.9);
        
        .sidebar,
        .navigation-sidebar,
        .sidebar-pane,
        .content-pane .sidebar-pane,
        .sidebar-pane .content-pane,
        scrolledwindow>viewport>list /* Gnome Tweaks */{
            background-color: @sidebar_bg_color;
        }
        .sidebar:backdrop,
        .navigation-sidebar:backdrop,
        .sidebar-pane:backdrop,
        .content-pane .sidebar-pane:backdrop,
        .sidebar-pane .content-pane:backdrop,
        scrolledwindow>viewport>list:backdrop {
            background-color: @sidebar_backdrop_color;
        }
        `;
    }
    
    if(cdHint) {
        gtkstring += `
        @define-color card_bg_color rgb(${cbgRed}, ${cbgGreen}, ${cbgBlue});
        @define-color card_backdrop_color rgb(${cbdRed}, ${cbdGreen}, ${cbdBlue});
        @define-color card_fg_color rgba(${cfgRed}, ${cfgGreen}, ${cfgBlue}, 0.9);
        
        @define-color dialog_bg_color rgb(${cbgRed}, ${cbgGreen}, ${cbgBlue});
        @define-color dialog_backdrop_color rgb(${cbdRed}, ${cbdGreen}, ${cbdBlue});
        @define-color dialog_fg_color rgba(${cfgRed}, ${cfgGreen}, ${cfgBlue}, 0.9);
        `;
    }
    
    if(popoverMenu) {
        gtkstring += `
        @define-color popover_bg_color rgba(${mbgRed}, ${mbgGreen}, ${mbgBlue}, ${mbgAlpha});
        @define-color popover_fg_color rgba(${mfgRed}, ${mfgGreen}, ${mfgBlue}, 0.9);
        popover > contents {
            ${obar.popoverContentStyle} 
        }
        `;
    }
    
    if(trafficLightButtons) {
        gtkstring += `
        button.titlebutton,
        windowcontrols > button {
          color: transparent;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
          min-width: 16px;
          min-height: 16px;
          border-radius: 100%;
          padding: 0;
          margin: 0 2px;
        }

        button.titlebutton:backdrop,
        windowcontrols > button:backdrop {
          opacity: 0.65;
        }
        
        button.titlebutton > image,
        windowcontrols > button > image {
          padding: 0;
        }

        .titlebar .right,
        windowcontrols.end {
          margin-right: 8px;
        }

        .titlebar .left,
        windowcontrols.start {
          margin-left: 8px;
        }

        button.titlebutton:hover,
        windowcontrols > button:hover {
            color: rgba(25, 25, 25, 0.9);
        }
        
        button.titlebutton.close, 
        button.titlebutton.close:hover:backdrop,
        windowcontrols > button.close,
        windowcontrols > button.close:hover:backdrop {
          background-color: #ff605c;
          background-image: none;
        }

        button.titlebutton.close:hover,
        windowcontrols > button.close:hover {
          background-color: shade(#ff605c,1.1);
        }

        button.titlebutton.maximize, 
        button.titlebutton.maximize:hover:backdrop,
        windowcontrols > button.maximize,
        windowcontrols > button.maximize:hover:backdrop {
          background-color: #00ca4e;
          background-image: none;
        }

        button.titlebutton.maximize:hover,
        windowcontrols > button.maximize:hover {
          background-color: shade(#00ca4e,1.1);
        }

        button.titlebutton.minimize, 
        button.titlebutton.minimize:hover:backdrop,
        windowcontrols > button.minimize,
        windowcontrols > button.minimize:hover:backdrop {
          background-color: #ffbd44;
          background-image: none;
        }

        button.titlebutton.minimize:hover,
        windowcontrols > button.minimize:hover {
          background-color: shade(#ffbd44,1.1);
        }

        button.titlebutton.close:backdrop, button.titlebutton.maximize:backdrop, button.titlebutton.minimize:backdrop,
        windowcontrols > button.close:backdrop, windowcontrols > button.maximize:backdrop, windowcontrols > button.minimize:backdrop {
          background-color: #c0bfc0;
        }
        `;
    }

    if(sBarTransparency) {
        gtkstring += `
        window, window.background,
        .nautilus-window {
            background: alpha(@window_bg_color, 0.9);
        }
        .content-pane, .content-pane.view,
        .boxed-list {
            opacity: 1.0;
        }
        `;
    }

    return gtkstring;
}

// Save Gtk stylesheet to user config dir
function saveGtkCss(obar, caller) {
    const importExport = obar._settings.get_boolean('import-export');
    const pauseStyleReload = obar._settings.get_boolean('pause-reload');
    if(importExport || pauseStyleReload)
        return;
    // console.log('saveGtkCss called with ImportExport false, Pause false');
    
    const applyGtk = obar._settings.get_boolean('apply-gtk');
    const configDir = GLib.get_user_config_dir();
    const gtk3Dir = Gio.File.new_for_path(`${configDir}/gtk-3.0`);
    const gtk4Dir = Gio.File.new_for_path(`${configDir}/gtk-4.0`);
    [gtk3Dir, gtk4Dir].forEach(dir => {
        // console.log(dir.get_path() +'\n' + gtkstring);

        // Create dir if missing
        if (!dir.query_exists(null)) {
            try {
                const file = Gio.File.new_for_path(dir.get_path());
                file.make_directory_with_parents(null);
            } catch (e) {
                console.error('Error creating gtk config directory: ' + e);
            }
        }
        
        let file = Gio.File.new_for_path(dir.get_path() + '/gtk.css');
        let backup = Gio.File.new_for_path(dir.get_path() + '/gtk_backup_byOpenBar.css');
        const isGtk = file.query_exists(null);
        const isBackupOpenBar = backup.query_exists(null);
        let isGtkOpenBar = false;
        if(isGtk) {
            try {
                const [ok, contents, etag] = file.load_contents(null);
                if(ok) {
                    const decoder = new TextDecoder('utf-8');
                    const contentsString = decoder.decode(contents);
                    const contentsHeader = contentsString.split('\n')[1];
                    if(contentsHeader)
                        isGtkOpenBar = contentsHeader.includes('/*** Open Bar GTK CSS ***/');
                }
            }
            catch (e) {
                console.error('Error reading gtk.css: ' + e);
            }
        }        

        // Disable extension or turn off Gtk app style
        if(caller == 'disable' || !applyGtk) {
            if(isGtkOpenBar && isBackupOpenBar) {
                try { // Restore backup
                    backup.move(file, Gio.FileCopyFlags.OVERWRITE, null, null);
                } 
                catch (e) {
                    console.error('Error restoring gtk.css from backup: ' + e);
                }
            }
            else if(isGtkOpenBar) {
                try {
                    file.delete(null);
                }
                catch (e) {
                    console.error('Error deleting OpenBar gtk.css: ' + e);
                }
            }
        }
        // Turn On Gtk: Backup if existing (non-openbar) gtk.css and create new OpenBar gtk.css
        else if(applyGtk) {
            if(isGtk && !isGtkOpenBar) { 
                try {
                    file.move(backup, Gio.FileCopyFlags.OVERWRITE, null, null);
                }
                catch (e) {
                    console.error('Error backing up gtk.css: ' + e);
                }
            }

            // Create stylesheet string and save to css file
            let gtkstring = createGtkCss(obar);
            let bytearray = new TextEncoder().encode(gtkstring);
            try {
                let output = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
                let outputStream = Gio.BufferedOutputStream.new_sized(output, 4096);
                outputStream.write_all(bytearray, null);
                outputStream.close(null);
                // console.log('Saved gtk.css at: ' + dir.get_path());
            }
            catch (e) {
                console.log("Failed to write gtk.css file: " + dir.get_path() + e);
            }
        }        
    });  
}

// Apply override to provide flatpak apps access to Gtk config css files
function saveFlatpakOverrides(obar, caller) {
    const applyFlatpak = obar._settings.get_boolean('apply-flatpak');
    const dataDir = GLib.get_user_data_dir();
    const overrideDir = Gio.File.new_for_path(`${dataDir}/flatpak/overrides`);
    if (!overrideDir.query_exists(null)) {
        try {
            const file = Gio.File.new_for_path(overrideDir.get_path());
            file.make_directory_with_parents(null);
        } catch (e) {
            console.error('Error creating flatpak override directory: ' + e);
        }
    }

    let keyfile = GLib.KeyFile.new();
    let global = Gio.File.new_for_path(overrideDir.get_path() + '/global');
    if(!global.query_exists(null)) {
        try {
            global.create(Gio.FileCreateFlags.NONE, null);
            keyfile.set_string('Context', 'filesystems', '');
            keyfile.save_to_file(global.get_path());
        }
        catch (e) {
            console.error('Error creating flatpak override global file: ' + e);
        }
    }

    try {
        keyfile.load_from_file(global.get_path(), GLib.KeyFileFlags.NONE);
    }
    catch (e) {
        console.error('Error loading flatpak override global file: ' + e);
    }

    try {
        if(caller == 'disable' || !applyFlatpak) {
            if(!obar.fsystemBackup) 
                obar.fsystemBackup = '';
            keyfile.set_string('Context', 'filesystems', obar.fsystemBackup);
            keyfile.save_to_file(global.get_path());
        }
        else if(applyFlatpak) {
            obar.fsystemBackup = keyfile.get_string('Context', 'filesystems');
            if(!obar.fsystemBackup) 
                obar.fsystemBackup = '';
            let fsystem = obar.fsystemBackup + ';xdg-config/gtk-3.0:ro;xdg-config/gtk-4.0:ro;';
            keyfile.set_string('Context', 'filesystems', fsystem);
            keyfile.save_to_file(global.get_path());
        }
    }
    catch (e) {
        console.error('Error saving flatpak override global file: ' + e);
    }
}

// Generate stylesheet string and save stylesheet file
function saveStylesheet(obar, Me) {

    let bartype = obar._settings.get_string('bartype');
    let boxcolor = obar._settings.get_strv('boxcolor');
    let boxalpha = obar._settings.get_double('boxalpha');
    let bgcolor = obar._settings.get_strv('bgcolor');
    let gradient = obar._settings.get_boolean('gradient');
    let grDirection = obar._settings.get_string('gradient-direction');
    let bgcolor2 = obar._settings.get_strv('bgcolor2');
    let bgalpha = obar._settings.get_double('bgalpha');
    let bgalpha2 = obar._settings.get_double('bgalpha2');
    let fgcolor = obar._settings.get_strv('fgcolor');
    let fgalpha = obar._settings.get_double('fgalpha');
    let borderColor = obar._settings.get_strv('bcolor');
    let balpha = obar._settings.get_double('balpha');
    let borderWidth = obar._settings.get_double('bwidth');
    let borderRadius = obar._settings.get_double('bradius');
    let bordertype = obar._settings.get_string('bordertype');
    let shcolor = obar._settings.get_strv('shcolor');
    let shalpha = obar._settings.get_double('shalpha');
    let islandsColor = obar._settings.get_strv('iscolor');
    let isalpha = obar._settings.get_double('isalpha');
    let neon = obar._settings.get_boolean('neon');
    let shadow = obar._settings.get_boolean('shadow');      
    let font = obar._settings.get_string("font");
    let height = obar._settings.get_double('height');
    let margin = obar._settings.get_double('margin');
    let hColor = obar._settings.get_strv('hcolor');
    let hAlpha = obar._settings.get_double('halpha');
    let hPad = obar._settings.get_double('hpad');
    let vPad = obar._settings.get_double('vpad');
    let hovereffect = obar._settings.get_boolean('heffect');
    let mfgColor = obar._settings.get_strv('mfgcolor');
    let mfgAlpha = obar._settings.get_double('mfgalpha');
    let mbgColor = obar._settings.get_strv('mbgcolor');
    let mbgAlpha = obar._settings.get_double('mbgalpha');
    let mbColor = obar._settings.get_strv('mbcolor');
    let mbAlpha = obar._settings.get_double('mbalpha');
    let mhColor = obar._settings.get_strv('mhcolor');
    let mhAlpha = obar._settings.get_double('mhalpha');
    let mshColor = obar._settings.get_strv('mshcolor');
    let mshAlpha = obar._settings.get_double('mshalpha');
    let msColor = obar._settings.get_strv('mscolor');
    let msAlpha = obar._settings.get_double('msalpha');
    let smbgColor = obar._settings.get_strv('smbgcolor');
    let smbgOverride = obar._settings.get_boolean('smbgoverride');
    let bgcolorWMax = obar._settings.get_strv('bgcolor-wmax');
    let bgalphaWMax = obar._settings.get_double('bgalpha-wmax');
    let custMarginWmax = obar._settings.get_boolean('cust-margin-wmax');
    let marginWMax = obar._settings.get_double('margin-wmax');
    let neonWMax = obar._settings.get_boolean('neon-wmax');
    let borderWMax = obar._settings.get_boolean('border-wmax');
    let menuRadius = obar._settings.get_double('menu-radius');
    let notifRadius = obar._settings.get_double('notif-radius');
    let qtoggleRadius = obar._settings.get_double('qtoggle-radius');
    let sliderHeight = obar._settings.get_double('slider-height');
    let sliHandBorder = obar._settings.get_double('handle-border');
    let mbgGradient = obar._settings.get_boolean('mbg-gradient');
    let autofgBar = obar._settings.get_boolean('autofg-bar');
    let autofgMenu = obar._settings.get_boolean('autofg-menu');
    let widthTop = obar._settings.get_boolean('width-top');
    let widthBottom = obar._settings.get_boolean('width-bottom');
    let widthLeft = obar._settings.get_boolean('width-left');
    let widthRight = obar._settings.get_boolean('width-right');
    let radiusTopLeft = obar._settings.get_boolean('radius-topleft');
    let radiusTopRight = obar._settings.get_boolean('radius-topright');
    let radiusBottomLeft = obar._settings.get_boolean('radius-bottomleft');
    let radiusBottomRight = obar._settings.get_boolean('radius-bottomright');
    let applyMenuShell = obar._settings.get_boolean('apply-menu-shell');
    let dbgColor = obar._settings.get_strv('dbgcolor');
    let dbgAlpha = obar._settings.get_double('dbgalpha');
    let dbRadius = obar._settings.get_double('dbradius');
    let dIconSize = obar._settings.get_double('disize');
    let dBorder = obar._settings.get_boolean('dborder');
    let dShadow = obar._settings.get_boolean('dshadow');
    let warningColor = obar._settings.get_strv('warning-color');
    let successColor = obar._settings.get_strv('success-color');
    let destructColor = obar._settings.get_strv('destruct-color');
    
    // Gnome default colors
    // destructive Dark: c01c28 (192,28,40)    Light: e01b24 (224,27,36)
    // success     Dark: 26a269 (38,162,105)   Light: 2ec27e (46,194,126)
    // warning     Dark: f6d32d (246,211,45)   Light: f5c211 (245,194,17)

    let warningRed = parseInt(parseFloat(warningColor[0]) * 255);
    let warningGreen = parseInt(parseFloat(warningColor[1]) * 255);
    let warningBlue = parseInt(parseFloat(warningColor[2]) * 255);

    let successRed = parseInt(parseFloat(successColor[0]) * 255);
    let successGreen = parseInt(parseFloat(successColor[1]) * 255);
    let successBlue = parseInt(parseFloat(successColor[2]) * 255);

    let destructRed = parseInt(parseFloat(destructColor[0]) * 255);
    let destructGreen = parseInt(parseFloat(destructColor[1]) * 255);
    let destructBlue = parseInt(parseFloat(destructColor[2]) * 255);

    let fgred = parseInt(parseFloat(fgcolor[0]) * 255);
    let fggreen = parseInt(parseFloat(fgcolor[1]) * 255);
    let fgblue = parseInt(parseFloat(fgcolor[2]) * 255);

    const bgred = parseInt(parseFloat(bgcolor[0]) * 255);
    const bggreen = parseInt(parseFloat(bgcolor[1]) * 255);
    const bgblue = parseInt(parseFloat(bgcolor[2]) * 255);

    const boxred = parseInt(parseFloat(boxcolor[0]) * 255);
    const boxgreen = parseInt(parseFloat(boxcolor[1]) * 255);
    const boxblue = parseInt(parseFloat(boxcolor[2]) * 255);

    const bgred2 = parseInt(parseFloat(bgcolor2[0]) * 255);
    const bggreen2 = parseInt(parseFloat(bgcolor2[1]) * 255);
    const bgblue2 = parseInt(parseFloat(bgcolor2[2]) * 255);

    const bgredwmax = parseInt(parseFloat(bgcolorWMax[0]) * 255);
    const bggreenwmax = parseInt(parseFloat(bgcolorWMax[1]) * 255);
    const bgbluewmax = parseInt(parseFloat(bgcolorWMax[2]) * 255);

    const isred = parseInt(parseFloat(islandsColor[0]) * 255);
    const isgreen = parseInt(parseFloat(islandsColor[1]) * 255);
    const isblue = parseInt(parseFloat(islandsColor[2]) * 255);

    const bred = parseInt(parseFloat(borderColor[0]) * 255);
    const bgreen = parseInt(parseFloat(borderColor[1]) * 255);
    const bblue = parseInt(parseFloat(borderColor[2]) * 255);

    const shred = parseInt(parseFloat(shcolor[0]) * 255);
    const shgreen = parseInt(parseFloat(shcolor[1]) * 255);
    const shblue = parseInt(parseFloat(shcolor[2]) * 255);

    const hred = parseInt(parseFloat(hColor[0]) * 255);
    const hgreen = parseInt(parseFloat(hColor[1]) * 255);
    const hblue = parseInt(parseFloat(hColor[2]) * 255);

    const dbgred = parseInt(parseFloat(dbgColor[0]) * 255);
    const dbggreen = parseInt(parseFloat(dbgColor[1]) * 255);
    const dbgblue = parseInt(parseFloat(dbgColor[2]) * 255);

    let mfgred = parseInt(parseFloat(mfgColor[0]) * 255);
    let mfggreen = parseInt(parseFloat(mfgColor[1]) * 255);
    let mfgblue = parseInt(parseFloat(mfgColor[2]) * 255);

    const mbgred = parseInt(parseFloat(mbgColor[0]) * 255);
    const mbggreen = parseInt(parseFloat(mbgColor[1]) * 255);
    const mbgblue = parseInt(parseFloat(mbgColor[2]) * 255);

    const mbred = parseInt(parseFloat(mbColor[0]) * 255);
    const mbgreen = parseInt(parseFloat(mbColor[1]) * 255);
    const mbblue = parseInt(parseFloat(mbColor[2]) * 255);

    const mhred = parseInt(parseFloat(mhColor[0]) * 255);
    const mhgreen = parseInt(parseFloat(mhColor[1]) * 255);
    const mhblue = parseInt(parseFloat(mhColor[2]) * 255);
    // Save menu highlight hex for use in focused svg
    obar.mhHex = rgbToHex(mhred, mhgreen, mhblue);

    const mshred = parseInt(parseFloat(mshColor[0]) * 255);
    const mshgreen = parseInt(parseFloat(mshColor[1]) * 255);
    const mshblue = parseInt(parseFloat(mshColor[2]) * 255);

    const msred = parseInt(parseFloat(msColor[0]) * 255);
    const msgreen = parseInt(parseFloat(msColor[1]) * 255);
    const msblue = parseInt(parseFloat(msColor[2]) * 255);
    // Save menu selection hex for use in toggle on svg
    obar.msHex = rgbToHex(msred, msgreen, msblue);
    obar.msHex = obar.msHex + parseInt(parseFloat(msAlpha)*255).toString(16);

    const darkMode = obar._intSettings.get_string('color-scheme') == 'prefer-dark';


    const mbg = `rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha})`; // menu bg
    const msc = `rgba(${msred},${msgreen},${msblue},${msAlpha})`; // menu selection/accent

    // Sub/Secondary menu color -
    let smbg, smbgred, smbggreen, smbgblue;
    // Manual Override: If 'override' enabled, submenu color with user defined values
    if(smbgOverride) {
        smbgred = parseInt(parseFloat(smbgColor[0]) * 255);
        smbggreen = parseInt(parseFloat(smbgColor[1]) * 255);
        smbgblue = parseInt(parseFloat(smbgColor[2]) * 255);
        smbg = `rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha})`;
    }
    else {
    // Auto-generated: go from bgcolor move towards white/black based on bgcolor darkness
        const lightrgba = `rgba(${255},${255},${255},${1.0})`;
        const darkrgba = `rgba(${0},${0},${0},${1.0})`;
        let bgdark = getBgDark(mbgred, mbggreen, mbgblue);
        let smbgTarget = bgdark? lightrgba: darkrgba;
        let [rTarget, gTarget, bTarget] = bgdark? [255,255,255]: [0,0,0];
        smbgred = colorMix(mbgred, rTarget, 0.18);
        smbggreen = colorMix(mbggreen, gTarget, 0.18);
        smbgblue = colorMix(mbgblue, bTarget, 0.18);
        smbg = colorBlend(mbg, smbgTarget, 0.18);
    }
    
    // Auto Highlight BG colors
    let hspThresh = 155, hgColor, bgColor, bgDarkThresh = 135, bgLightThresh = 180;
    
    function getAutoHgColor(bgColor) { 
        let bgHsp = getHSP(bgColor);
        if(bgHsp <= bgLightThresh) {
            let rgb = bgHsp + 75;
            hgColor = [rgb, rgb, rgb];
        }
        else {
            let rgb = bgHsp - 75;
            hgColor = [rgb, rgb, rgb];
        }
        // log('getAutoHgColor: hgColor, bgColor, bgHsp ', hgColor, bgColor, bgHsp);
        return hgColor;
    }

    // Bar Auto Highlight
    let autohgBar = obar._settings.get_boolean('autohg-bar');
    hgColor = [hred, hgreen, hblue];
    bgColor = [bgred, bggreen, bgblue];
    if(autohgBar)
        hgColor = getAutoHgColor(bgColor);
    
    let hbgred = bgred*(1-hAlpha) + hgColor[0]*hAlpha;
    let hbggreen = bggreen*(1-hAlpha) + hgColor[1]*hAlpha;
    let hbgblue = bgblue*(1-hAlpha) + hgColor[2]*hAlpha;
    let phbg = `rgba(${hbgred},${hbggreen},${hbgblue},${bgalpha})`;

    // Island Auto Highlight
    hgColor = [hred, hgreen, hblue];
    bgColor = [isred, isgreen, isblue];
    if(autohgBar)
        hgColor = getAutoHgColor(bgColor);

    let ishbgred = isred*(1-hAlpha) + hgColor[0]*hAlpha;
    let ishbggreen = isgreen*(1-hAlpha) + hgColor[1]*hAlpha;
    let ishbgblue = isblue*(1-hAlpha) + hgColor[2]*hAlpha;
    let ihbg = `rgba(${ishbgred},${ishbggreen},${ishbgblue},${isalpha})`;

    // Menu Auto Highlight
    let autohgMenu = obar._settings.get_boolean('autohg-menu');
    hgColor = [mhred, mhgreen, mhblue];
    bgColor = [mbgred, mbggreen, mbgblue];
    if(autohgMenu)
        hgColor = getAutoHgColor(bgColor);

    let mhbgred = mbgred*(1-mhAlpha) + hgColor[0]*mhAlpha;
    let mhbggreen = mbggreen*(1-mhAlpha) + hgColor[1]*mhAlpha;
    let mhbgblue = mbgblue*(1-mhAlpha) + hgColor[2]*mhAlpha;
    let mhbg = `rgba(${mhbgred},${mhbggreen},${mhbgblue},${mbgAlpha})`;
    
    // Sub Menu Auto Highlight
    hgColor = [mhred, mhgreen, mhblue];
    bgColor = [smbgred, smbggreen, smbgblue];
    if(autohgMenu)
        hgColor = getAutoHgColor(bgColor);   

    let smhbgred = smbgred*(1-mhAlpha) + hgColor[0]*mhAlpha;
    let smhbggreen = smbggreen*(1-mhAlpha) + hgColor[1]*mhAlpha;
    let smhbgblue = smbgblue*(1-mhAlpha) + hgColor[2]*mhAlpha;
    let smhbg = `rgba(${smhbgred},${smhbggreen},${smhbgblue},${mbgAlpha})`;

    // Active/Accent Auto Highlight
    hgColor = [mhred, mhgreen, mhblue];
    bgColor = [msred, msgreen, msblue];
    if(autohgMenu)
        hgColor = getAutoHgColor(bgColor);

    let mshbgred = msred*(1-mhAlpha) + hgColor[0]*mhAlpha;
    let mshbggreen = msgreen*(1-mhAlpha) + hgColor[1]*mhAlpha;
    let mshbgblue = msblue*(1-mhAlpha) + hgColor[2]*mhAlpha;
    let mshg = `rgba(${mshbgred},${mshbggreen},${mshbgblue},${msAlpha})`; //msalpha
    

    ///// FG COLORS for BAR and MENU
    // Bar highlight fg color
    let hfgred, hfggreen, hfgblue;
    if(bartype == 'Mainland' || bartype == 'Floating') {
        hfgred = colorMix(fgred, hbgred, -0.12);
        hfggreen = colorMix(fggreen, hbggreen, -0.12);
        hfgblue = colorMix(fgblue, hbgblue, -0.12);
    }
    else {
        hfgred = colorMix(fgred, ishbgred, -0.12);
        hfggreen = colorMix(fggreen, ishbggreen, -0.12);
        hfgblue = colorMix(fgblue, ishbgblue, -0.12);
    }
    if(autofgBar) {
        // Bar auto fg color
        let dark;
        if(bartype == 'Mainland' || bartype == 'Floating')
            dark = getBgDark(bgred, bggreen, bgblue);
        else
            dark = getBgDark(isred, isgreen, isblue);
        if(dark) {
            fgred = fggreen = fgblue = 250;
            hfgred = hfggreen = hfgblue = 255;
        }
        else {
            fgred = fggreen = fgblue = 5;
            hfgred = hfggreen = hfgblue = 0;
        }
    }

    // Set menu auto FG colors as per background OR else set as per user override
    let smfgred, smfggreen, smfgblue, amfgred, amfggreen, amfgblue;
    // Menu highlight fg color
    let mhfgred = colorMix(mfgred, mhbgred, -0.12);
    let mhfggreen = colorMix(mfggreen, mhbggreen, -0.12);
    let mhfgblue = colorMix(mfgblue, mhbgblue, -0.12);

    // Sub Menu highlight fg color
    let smhfgred = colorMix(mfgred, smhbgred, -0.12);
    let smhfggreen = colorMix(mfggreen, smhbggreen, -0.12);
    let smhfgblue = colorMix(mfgblue, smhbgblue, -0.12);

    // Accent highlight fg color
    let amhfgred = colorMix(mfgred, mshbgred, -0.12);
    let amhfggreen = colorMix(mfggreen, mshbggreen, -0.12);
    let amhfgblue = colorMix(mfgblue, mshbgblue, -0.12);

    if(autofgMenu) {
        // Menu auto fg color
        if(getBgDark(mbgred, mbggreen, mbgblue)) {
            mfgred = mfggreen = mfgblue = 230;
            mhfgred = mhfggreen = mhfgblue = 255;
        }
        else {
            mfgred = mfggreen = mfgblue = 25;
            mhfgred = mhfggreen = mhfgblue = 0;
        }

        // Sub menu auto fg color
        if(getBgDark(smbgred, smbggreen, smbgblue)) {
            smfgred = smfggreen = smfgblue = 230;
            smhfgred = smhfggreen = smhfgblue = 255;
        }
        else {
            smfgred = smfggreen = smfgblue = 25;
            smhfgred = smhfggreen = smhfgblue = 0;
        }

        // Accent / active auto fg color
        if(getBgDark(msred, msgreen, msblue)) {
            amfgred = amfggreen = amfgblue = 250;
            amhfgred = amhfggreen = amhfgblue = 255;
        }
        else {
            amfgred = amfggreen = amfgblue = 10;
            amhfgred = amhfggreen = amhfgblue = 0;
        }
    }
    else { // Manual overrides
        smfgred = mfgred;
        smfggreen = mfggreen;
        smfgblue = mfgblue;
        amfgred = mfgred;
        amfggreen = mfggreen;
        amfgblue = mfgblue;
    }
    // Save submenu fg hex for use in calendar-today svg
    obar.smfgHex = rgbToHex(smfgred, smfggreen, smfgblue);


    //== Define Styles for Bar components ==//

    let fgStyle, panelStyle, panelLabelStyle, btnStyle, btnContainerStyle, borderStyle, radiusStyle, fontStyle, 
    islandStyle, dotStyle, neonStyle, gradientStyle, triLeftStyle, triBothStyle, triRightStyle, 
    triMidStyle, triMidNeonStyle, btnHoverStyle;      

    // style that applies dynamically to either the panel or the panel buttons as per bar type
    borderStyle = 
    ` border: 0px ${bordertype} rgba(${bred},${bgreen},${bblue},${balpha}); `;
    if(widthTop) borderStyle += ` border-top-width: ${borderWidth}px; `;
    if(widthRight) borderStyle += ` border-right-width: ${borderWidth}px; `;
    if(widthBottom) borderStyle += ` border-bottom-width: ${borderWidth}px; `;
    if(widthLeft) borderStyle += ` border-left-width: ${borderWidth}px; `;
    
    let rTopLeft, rTopRight, rBottomLeft, rBottomRight;
    if(bartype == 'Islands' || bartype == 'Trilands') {
        // Limit on max border radius (border grows inwards for Islands. '-1' for sub-pixel rounding)
        // Limit is needed for proper rendering of border and neon shadow
        let bWidthRound = Math.ceil(borderWidth);
        if(borderRadius > height/2 - bWidthRound - 1) 
            borderRadius = Math.floor(height/2 - bWidthRound - 1);
    }
    rTopLeft = radiusTopLeft? borderRadius: 0;
    rTopRight = radiusTopRight? borderRadius: 0;
    rBottomLeft = radiusBottomLeft? borderRadius: 0;
    rBottomRight = radiusBottomRight? borderRadius: 0;
    radiusStyle = ` border-radius: ${rTopLeft}px ${rTopRight}px ${rBottomRight}px ${rBottomLeft}px; `;

    // if (bordertype == 'double') // Radius not supported on outline
    //     style += ` outline: ${borderWidth}px ${bordertype} rgba(${bred},${bgreen},${bblue},${balpha}); `;

    // foreground style needed for both panel and buttons (all bar types)
    fgStyle =
    ` color: rgba(${fgred},${fggreen},${fgblue},${fgalpha}) !important; `;
    
    // panel style for panel only (all bar types)
    panelStyle = 
    ` background-color: rgba(${bgred},${bggreen},${bgblue},${bgalpha}) !important; 
      height: ${height}px !important; `;

    panelStyle += 
    ` ${radiusStyle} `;

    // button style for buttons only (all bar types)
    btnStyle = 
    ` margin: 0px; height: ${height}px !important; `;

    // island style for buttons (only island bar type)
    islandStyle = 
    ` background-color: rgba(${isred},${isgreen},${isblue},${isalpha}) !important; `;
    
    // Triland style for left end btn of box (only triland bar type)
    triLeftStyle = 
    ` border-radius: ${borderRadius}px 0px 0px ${borderRadius}px !important; `;
    // Triland style for single btn box (only triland bar type)
    triBothStyle = 
    ` ${radiusStyle} `;
    // Triland style for right end btn of box (only triland bar type)
    triRightStyle = 
    ` border-radius: 0px ${borderRadius}px ${borderRadius}px 0px !important; `;
    // Triland style for middle btns of box (only triland bar type)
    triMidStyle = 
    ` border-radius: 0px !important; `;

    // Workspace dots style
    dotStyle = 
    ` background-color: rgba(${fgred},${fggreen},${fgblue},${fgalpha}) !important; `;

    // Add font style to panelstyle (works on all bar types)
    let font_weight = 400;
    if (font != ""){
        let font_desc = Pango.font_description_from_string(font); 
        let font_family = font_desc.get_family();
        let font_style_arr = ['normal', 'oblique', 'italic'];
        let font_style = font_style_arr[font_desc.get_style()];
        let font_stretch_arr = ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'];
        let font_stretch = font_stretch_arr[font_desc.get_stretch()];
        let font_size = font_desc.get_size() / Pango.SCALE;        
        try{
            font_weight = font_desc.get_weight();
        }catch(e){
            font_weight = Math.round(font_weight/100)*100;
        }
        
        fontStyle = 
        `   font-size: ${font_size}pt; 
            font-family: "${font_family}"; 
            font-style: ${font_style}; 
            font-stretch: ${font_stretch}; 
            font-variant: normal; `; 
    }
    else
        fontStyle = '';
    // Apply semi-bold if font weight is less than 500 when auto-theme is applied
    let autothemeApplied = obar._settings.get_boolean('autotheme-font');
    if(autothemeApplied && font_weight < 500)
        font_weight = 500;
    fontStyle +=
    `   font-weight: ${font_weight}; `;

    panelLabelStyle = 
    ` ${fontStyle} `;

    // Box shadow not working with rectangular box (for smaller radius), why Gnome??
    // Fix: Negative/low spread to try to contain it in that range. Range depends on bar height
    // padmod: modify formula to account for container padding in islands/trilands
    let padmod = (bartype == 'Mainland' || bartype == 'Floating')? -2: vPad;
    let radThreshold = Math.ceil(((height-2*padmod)/10.0 - 1)*5) ; 

    // Add the neon style if enabled
    if (neon) {
        let spread;           
        if(borderRadius <= radThreshold) {
            spread = gradient? -3: 0;               
        }
        else {
            if((rTopLeft == 0 && rTopRight == 0) || (rBottomLeft == 0 && rBottomRight == 0))
                spread = 0;
            else
                spread = 2;
        }

        neonStyle =               
        ` box-shadow: 0px 0px 4px ${spread}px rgba(${bred},${bgreen},${bblue},0.55); `;
        
        spread = gradient? -3: 0; 
        triMidNeonStyle = 
        ` box-shadow: 0px 0px 4px ${spread}px rgba(${bred},${bgreen},${bblue},0.55); `;
    }
    else {
        neonStyle = ``; 
        triMidNeonStyle = ``;
    }
    triMidStyle += triMidNeonStyle;

    // Panel hover/focus style
    let triMidNeonHoverStyle = ``;
    if(hovereffect) { // Hover with border
        btnHoverStyle = 
        ` border: ${height/10.0}px solid rgba(${hred},${hgreen},${hblue},${hAlpha}) !important; `;
        if(neon && (bartype == 'Islands' || bartype == 'Trilands')) {
            btnHoverStyle += neonStyle.replace(`${bred},${bgreen},${bblue}`, `${hred},${hgreen},${hblue}`); 
            triMidNeonHoverStyle += triMidNeonStyle.replace(`${bred},${bgreen},${bblue}`, `${hred},${hgreen},${hblue}`);
        }
    }
    else {
        if(bartype == 'Mainland' || bartype == 'Floating')
            btnHoverStyle = 
            ` background-color: ${phbg} !important; `;
        else
            btnHoverStyle = 
            ` background-color: ${ihbg} !important; `;
    }
    if(bartype == 'Mainland' || bartype == 'Floating' || !neon) {
        btnHoverStyle += ` box-shadow: none !important; `;
    }

    // Add panel shadow if enabled. Use alpha to decide offset, blur, spread and alpha
    if (shadow) {
        if (borderRadius < radThreshold) {
            panelStyle += 
            ` box-shadow: 0px ${shalpha*10}px ${1.5+shalpha*15}px ${shalpha*10}px rgba(${shred},${shgreen},${shblue}, ${0.85*shalpha}); `;
        }
        else {
            panelStyle += 
            ` box-shadow: 0px ${shalpha*10}px ${1.5+shalpha*15}px ${shalpha*20}px rgba(${shred},${shgreen},${shblue}, ${0.85*shalpha}); `;
        }
    }
    else {
        panelStyle += 
        ` box-shadow: none; `;
    }

    // Add gradient to style if enabled
    if (gradient) {
        let startColor, endColor;
        if(bartype == 'Islands' || bartype == 'Trilands') {
            startColor = `rgba(${isred},${isgreen},${isblue},${isalpha})`;
        }
        else {
            startColor = `rgba(${bgred},${bggreen},${bgblue},${bgalpha})`;                
        }
        endColor = `rgba(${bgred2},${bggreen2},${bgblue2},${bgalpha2})`;
        gradientStyle  = 
        ` background-gradient-start: ${startColor};  
          background-gradient-end: ${endColor}; 
          background-gradient-direction: ${grDirection}; `;

        islandStyle = ``;
    }
    else
        gradientStyle = ``;

    // Candybar style 
    let candyalpha = obar._settings.get_double('candyalpha');
    let candyStyleArr = [], candyHighlightArr = [], candyDotStyle = '', candyClockStyle = '';
    let hgCandy = [hred, hgreen, hblue];
    for(let i=1; i<=16; i++) {
        let candyColor = obar._settings.get_strv('candy'+i);
        let cred = parseInt(parseFloat(candyColor[0]) * 255);
        let cgreen = parseInt(parseFloat(candyColor[1]) * 255);
        let cblue = parseInt(parseFloat(candyColor[2]) * 255);
        let calpha = candyalpha;
        let candyStyle = `background-color: rgba(${cred},${cgreen},${cblue},${calpha}) !important; `;
        
        // Candybar highlights
        let bgCandy = [cred, cgreen, cblue];
        if(autohgBar)
            hgCandy = getAutoHgColor(bgCandy);
        // Candy Highlight BG  
        let hgalpha = 0.8*hAlpha;
        let chred = cred*(1-hgalpha) + hgCandy[0]*hgalpha;
        let chgreen = cgreen*(1-hgalpha) + hgCandy[1]*hgalpha;
        let chblue = cblue*(1-hgalpha) + hgCandy[2]*hgalpha;
        let candyHgStyle = `background-color: rgba(${chred},${chgreen},${chblue},${calpha}) !important; `;

        // Candybar Auto FG Color
        let cfgred, cfggreen, cfgblue, chfgred, chfggreen, chfgblue;
        if(autofgBar) {
            if(getHSP(bgCandy) <= 180) {
                cfgred = cfggreen = cfgblue = 250;
                chfgred = chfggreen = chfgblue = 255;
            }
            else {
                cfgred = cfggreen = cfgblue = 5;
                chfgred = chfggreen = chfgblue = 0;
            }
            candyStyle += `color: rgba(${cfgred},${cfggreen},${cfgblue},${fgalpha}) !important;`;
            candyHgStyle += `color: rgba(${chfgred},${chfggreen},${chfgblue},${fgalpha}) !important;`;

            if(i==1) {
                candyDotStyle = `background-color: rgba(${cfgred},${cfggreen},${cfgblue},${fgalpha}) !important;`;
                candyClockStyle = `color: rgba(${chfgred},${chfggreen},${chfgblue},${fgalpha}) !important;`;
            }
        }

        candyStyleArr.push(candyStyle);
        candyHighlightArr.push(candyHgStyle);
    }

    
    if(bartype == 'Mainland') {
        panelStyle += 
        ` margin: 0px; border-radius: 0px; `;         
    }
    if(bartype == 'Floating') {
        panelStyle += 
        ` margin: ${margin}px ${3*margin}px; `;
    }
    if(bartype == 'Islands' || bartype == 'Trilands') {
        panelStyle += 
        ` margin: ${margin}px ${1.5*margin}px;  
          padding: 0px ${vPad}px;       
          ${fgStyle} `;  

        btnStyle += 
        ` ${borderStyle} 
          ${radiusStyle}
          ${fgStyle}
          ${islandStyle}
          ${gradientStyle}
          ${neonStyle} `;

        btnContainerStyle = 
        ` padding: ${vPad}px ${hPad}px;
          margin: 0px 0px;
          border-radius: ${borderRadius+borderWidth}px;
           `;
    }
    else {
        panelStyle += 
        ` ${fgStyle}
          ${borderStyle}
          ${gradientStyle}
          ${neonStyle} 
          padding: 0px ${vPad}px; `;
        
        btnStyle += 
        ` ${fgStyle}
          border-radius: ${Math.max(borderRadius, 5)}px; 
          border-width: 0px; `;

        btnContainerStyle = 
        ` padding: ${borderWidth+vPad}px ${borderWidth+hPad}px;
          margin: 0px 0px;
          border-radius: ${borderRadius+borderWidth}px; `; 
    }

    let heightWMax;
    if(custMarginWmax) {
        heightWMax = height + 2*marginWMax;
    }
    else {
        heightWMax = height + 2*margin;
        marginWMax = margin;
    }

    // Panel Menu Style
    let shadowAlpha = darkMode? mshAlpha : 0.5*mshAlpha;
    let borderAlpha = darkMode? mbAlpha : 0.6*mbAlpha;
    let menuContentStyle =
    `   box-shadow: 0 2px 4px 0px rgba(${mshred},${mshgreen},${mshblue},${shadowAlpha}) !important; /* menu shadow */
        border: 1px solid rgba(${mbred},${mbgreen},${mbblue},${borderAlpha}) !important; /* menu border */
        /* add menu font */
        background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}); /* menu bg */
        color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha}); /* menu fg */ 
        border-radius: ${menuRadius > 20? 20: menuRadius}px !important; `;
    // GTK Popover style
    obar.popoverContentStyle =
    `   box-shadow: 0 2px 4px 0px rgba(${mshred},${mshgreen},${mshblue},${0.5*mshAlpha});
        border: 1px solid rgba(${mbred},${mbgreen},${mbblue},${0.5*mbAlpha});
        background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha});
        color: rgba(${mfgred},${mfggreen},${mfgblue},${0.9*mfgAlpha});
        border-radius: ${menuRadius > 15? 15: menuRadius}px; `;
    if(mbgGradient) { // Light Gradient
        let mGradientStyle = 
        `   box-shadow: none !important;
            background-image: url(media/menu.svg);
            background-repeat: no-repeat;
            background-size: cover; `;
        menuContentStyle += mGradientStyle;
        // obar.popoverContentStyle += mGradientStyle;
    }

    // Slider
    let sliderBaseColor = `${colorMix(smbgred, mbgred, -0.2)},${colorMix(smbggreen, mbggreen, -0.2)},${colorMix(smbgblue, mbgblue, -0.2)}`;
    let sliderActiveColor = `${colorMix(msred, mbgred, -0.2)},${colorMix(msgreen, mbggreen, -0.2)},${colorMix(msblue, mbgblue, -0.2)}`;
    let bCol = mfgred > 200? 255: 0; // Slider border color
    let sliHandRadius = Math.ceil(8 - sliHandBorder/2);
    if(sliHandRadius < 4) sliHandRadius = 4;
    let sliderStyle = 
    `   color: rgba(${sliderBaseColor}, 1) !important;
        -barlevel-height: ${sliderHeight}px;
        -barlevel-border-width: 0.5px;
        -barlevel-border-color: rgba(${bCol},${bCol},${bCol},0.25) !important;
        -barlevel-active-border-color: rgba(${bCol},${bCol},${bCol},0.25) !important;
        -slider-handle-border-width: ${sliHandBorder}px;
        -slider-handle-radius: ${sliHandRadius}px;
        -slider-handle-border-color: rgba(${sliderActiveColor}, 1) !important;
        -barlevel-background-color: rgba(${sliderBaseColor}, 1) !important;
        -barlevel-active-background-color: rgba(${sliderActiveColor}, 1) !important;
        -barlevel-overdrive-color: rgba(${destructRed}, ${destructGreen}, ${destructBlue}, 1) !important;
         `;
    
    // Define Overview style (reset) if Disabled in Overview
    let setOverview = obar._settings.get_boolean('set-overview');
    let overviewStyle, barFgOverview, barHFgOverview, barHBgOverview, dotOverview;
    if(!setOverview) {
        overviewStyle = 
        `   background-color: transparent !important; 
            border-color: transparent !important; 
            box-shadow: none !important; 
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important; `;
        barFgOverview = 
        `   color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;`;
        barHFgOverview = 
        `   color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;`;
        barHBgOverview = 
        `   background-color: rgba(${smhbgred},${smhbggreen},${smhbgblue},${mbgAlpha}) !important;`;
        dotOverview = 
        `   background-color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;`;
    }
    else {
        overviewStyle = ``;
        barFgOverview = ``;
        barHFgOverview = ``;
        barHBgOverview = ``;
        dotOverview = ``;
    }

    let wmaxColorStyle, wmaxHoverStyle;
    if(bartype == 'Mainland' || bartype == 'Floating') {
        if(getBgDark(bgredwmax, bggreenwmax, bgbluewmax)) {
            wmaxColorStyle = 
            `color: rgba(250,250,250,1.0) !important;
            transition-duration: 100ms;`;
        }
        else {
            wmaxColorStyle = 
            `color: rgba(5,5,5,1.0) !important;
            transition-duration: 100ms;`;
        }
    }
    else {
        wmaxColorStyle = ``;
    }
    const candybar = obar._settings.get_boolean('candybar');
    if((bartype == 'Mainland' || bartype == 'Floating') && !candybar) {        
        let hgColor = [hred, hgreen, hblue], bgColor = [bgredwmax, bggreenwmax, bgbluewmax];
        if(autohgBar)
            hgColor = getAutoHgColor(bgColor);
        // WMax Highlight BG  
        let wmhred = bgColor[0]*(1-hAlpha) + hgColor[0]*hAlpha;
        let wmhgreen = bgColor[1]*(1-hAlpha) + hgColor[1]*hAlpha;
        let wmhblue = bgColor[2]*(1-hAlpha) + hgColor[2]*hAlpha;
        wmaxHoverStyle = 
        `background-color: rgba(${wmhred},${wmhgreen},${wmhblue},${hAlpha}) !important;
        transition-duration: 100ms;`;
    }
    else {
        wmaxHoverStyle = ``;
    }

    let unlockStyle, unlockHoverStyle;
    if(obar.main.sessionMode.isLocked) {
        unlockStyle =
        `   background-color: transparent !important; 
            border-color: transparent !important; 
            color: rgba(255,255,255,1.0) !important;
            box-shadow: none !important;
            transition-duration: 100ms;`;
    }
    else {
        unlockStyle = ``;
    }
    if(obar.main.sessionMode.isLocked) {
        unlockHoverStyle =
        `   color: rgba(255,255,255,1.0) !important;`;
    }
    else {
        unlockHoverStyle = ``;
    }
    
    // Toggle switch SVG
    let toggleOnSVG = 'toggle-on.svg', toggleOffSVG = 'toggle-off.svg';
    let hcMode = obar._hcSettings.get_boolean('high-contrast');
    if(hcMode && obar.gnomeVersion <= 45) {
        toggleOnSVG = 'toggle-on-hc.svg';
        toggleOffSVG = 'toggle-off-hc.svg';
    }

    let applyAllShell = obar._settings.get_boolean('apply-all-shell');
    // Add/Remove .openmenu class to Restrict/Extend menu styles to the shell
    let openmenuClass = (applyMenuShell || applyAllShell) ? '' : '.openmenu';
    // Placeholder for .openbar class
    let openbarClass = '.openbar';

    // Create Stylesheet string to write to file
    let stylesheet = `
    /* OpenBar stylesheet.css
    * This file is autogenerated. Do Not Edit.
    *
    * SPDX-License-Identifier: GPL-2.0-or-later
    * author: neuromorph
    */
    `;
    
    // Panel and buttons styles
    stylesheet += `
    
        #panelBox${openbarClass} {
           background-color: rgba(${boxred},${boxgreen},${boxblue},${boxalpha}) !important;
        }
    
        #panel${openbarClass} {
            ${panelStyle}
            ${unlockStyle}
        }

        #panel${openbarClass} StLabel {
            ${panelLabelStyle}
        }
        
        #panel${openbarClass}:windowmax {
            background-color: rgba(${bgredwmax},${bggreenwmax},${bgbluewmax},${bgalphaWMax}) !important;
            border-radius: 0px;
            border-color: rgba(${bgredwmax},${bggreenwmax},${bgbluewmax},${bgalphaWMax}) !important;
            box-shadow: none;
            margin: 0px;
            height: ${heightWMax}px !important;
            ${wmaxColorStyle}        
            ${unlockStyle}
        }

        #panel${openbarClass} .button-container {
            ${btnContainerStyle}
        }
        #panel${openbarClass}:windowmax .button-container {
            margin: ${marginWMax}px 0px;
        }

        #panel${openbarClass} .panel-button {
            ${btnStyle}
            color: rgba(${fgred},${fggreen},${fgblue},${fgalpha});
            ${unlockStyle}
        }
        #panel${openbarClass}:windowmax .panel-button {
            ${borderWMax? '': 'border-color: transparent;'}
            ${neonWMax? '': 'box-shadow: none;'} 
            ${wmaxColorStyle}                
        }

        #panel${openbarClass}:overview, #panel${openbarClass}:overview .panel-button {
            ${setOverview? '': overviewStyle}
        }

        #panel${openbarClass}:overview:windowmax {
            ${overviewStyle}
        }
        

        #panel${openbarClass} .panel-button:hover, #panel${openbarClass} .panel-button:focus, 
        #panel${openbarClass} .panel-button:active, #panel${openbarClass} .panel-button:checked {
            ${btnHoverStyle}
            color: rgba(${hfgred},${hfggreen},${hfgblue},${fgalpha}) !important;
            ${unlockHoverStyle}
        }
        #panel${openbarClass}:windowmax .panel-button:hover, #panel${openbarClass}:windowmax .panel-button:focus, 
        #panel${openbarClass}:windowmax .panel-button:active, #panel${openbarClass}:windowmax .panel-button:checked {
            ${wmaxColorStyle}
            ${wmaxHoverStyle}
        }
        #panel${openbarClass}:overview .panel-button:hover, #panel${openbarClass}:overview .panel-button:focus, 
        #panel${openbarClass}:overview .panel-button:checked, #panel${openbarClass}:overview .panel-button:active,
        #panel${openbarClass}:overview .panel-button:overview {
            ${btnHoverStyle} 
            ${setOverview? '': barHFgOverview}
            ${setOverview? '': barHBgOverview}
        }

        #panel${openbarClass} .panel-button.clock-display .clock {
            color: rgba(${fgred},${fggreen},${fgblue},${fgalpha}) !important;
        }
        #panel${openbarClass}:windowmax .panel-button.clock-display .clock {
            ${wmaxColorStyle}
        }
        #panel${openbarClass}:overview .panel-button.clock-display .clock {
            ${barFgOverview}
        }
        
        #panel${openbarClass} .panel-button:hover.clock-display .clock, #panel${openbarClass} .panel-button:focus.clock-display .clock,
        #panel${openbarClass} .panel-button:active.clock-display .clock, #panel${openbarClass} .panel-button:checked.clock-display .clock {
            color: rgba(${hfgred},${hfggreen},${hfgblue},1.0) !important;
        }
        #panel${openbarClass}:windowmax .panel-button:hover.clock-display .clock, #panel${openbarClass}:windowmax .panel-button:focus.clock-display .clock,
        #panel${openbarClass}:windowmax .panel-button:active.clock-display .clock, #panel${openbarClass}:windowmax .panel-button:checked.clock-display .clock {
            ${wmaxColorStyle}
        }
        #panel${openbarClass}:overview .panel-button:hover.clock-display .clock, #panel${openbarClass}:overview .panel-button:focus.clock-display .clock,
        #panel${openbarClass}:overview .panel-button:active.clock-display .clock, #panel${openbarClass}:overview .panel-button:checked.clock-display .clock {
            ${barHFgOverview}
        }
        
        #panel${openbarClass} .panel-button.clock-display .clock, #panel${openbarClass} .panel-button:hover.clock-display .clock,
        #panel${openbarClass} .panel-button:active.clock-display .clock, #panel${openbarClass} .panel-button:overview.clock-display .clock, 
        #panel${openbarClass} .panel-button:focus.clock-display .clock, #panel${openbarClass} .panel-button:checked.clock-display .clock {
            background-color: transparent !important;
            box-shadow: none !important;
        }

        #panel${openbarClass} .panel-button .screen-recording-indicator {
            transition-duration: 150ms;
            font-weight: bold;
            background-color: rgba(${destructRed},${destructGreen},${destructBlue}, 0.8);
            box-shadow: none !important;
        }
        #panel${openbarClass} .panel-button .screen-sharing-indicator,
        #panel${openbarClass} .screencast-indicator,
        #panel${openbarClass} .remote-access-indicator {
            transition-duration: 150ms;
            font-weight: bold;
            background-color: rgba(${(destructRed+warningRed)/2},${(destructGreen+warningGreen)/2},${(destructBlue+warningBlue)/2}, 0.9); 
            box-shadow: none !important;
        }

        #panel${openbarClass} .workspace-dot {
            ${dotStyle}
        }
        #panel${openbarClass}:overview .workspace-dot {
            ${dotOverview}
        }
        
        #panel${openbarClass} .trilands:left-child {
            ${triLeftStyle}
        }
        #panel${openbarClass} .trilands:right-child {
            ${triRightStyle}
        }
        #panel${openbarClass} .trilands:one-child {
            ${triBothStyle}
        }
        #panel${openbarClass} .trilands:mid-child {
            ${triMidStyle}
        }
        #panel${openbarClass}:overview .trilands:mid-child {
            ${setOverview? '': 'box-shadow: none;'}
        }
        #panel${openbarClass}:windowmax .trilands:mid-child {
            ${neonWMax? '': 'box-shadow: none;'}
        }
        #panel${openbarClass} .trilands:mid-child:hover, #panel${openbarClass} .trilands:mid-child:focus, #panel${openbarClass} .trilands:mid-child:active, #panel${openbarClass} .trilands:mid-child:checked {
            ${triMidNeonHoverStyle}
        }
        #panel${openbarClass}:overview .trilands:mid-child:hover, #panel${openbarClass}:overview .trilands:mid-child:focus, #panel${openbarClass}:overview .trilands:mid-child:active, #panel${openbarClass}:overview .trilands:mid-child:checked {
            ${setOverview? '': 'box-shadow: none;'}
        }
    `;

    // Candybar Styles
    stylesheet += `
        #panel${openbarClass} .panel-button.candy1 {
            ${candyStyleArr[0]}
        }
        #panel${openbarClass} .panel-button.candy1:hover, #panel${openbarClass} .panel-button.candy1:focus,
        #panel${openbarClass} .panel-button.candy1:active, #panel${openbarClass} .panel-button.candy1:checked {
            ${candyHighlightArr[0]}
        }
        #panel${openbarClass} .panel-button.candy2 {
            ${candyStyleArr[1]}
        }
        #panel${openbarClass} .panel-button.candy2:hover, #panel${openbarClass} .panel-button.candy2:focus,
        #panel${openbarClass} .panel-button.candy2:active, #panel${openbarClass} .panel-button.candy2:checked {
            ${candyHighlightArr[1]}
        }
        #panel${openbarClass} .panel-button.candy3 {
            ${candyStyleArr[2]}
        }
        #panel${openbarClass} .panel-button.candy3:hover, #panel${openbarClass} .panel-button.candy3:focus,
        #panel${openbarClass} .panel-button.candy3:active, #panel${openbarClass} .panel-button.candy3:checked {
            ${candyHighlightArr[2]}
        }
        #panel${openbarClass} .panel-button.candy4 {
            ${candyStyleArr[3]}
        }
        #panel${openbarClass} .panel-button.candy4:hover, #panel${openbarClass} .panel-button.candy4:focus,
        #panel${openbarClass} .panel-button.candy4:active, #panel${openbarClass} .panel-button.candy4:checked {
            ${candyHighlightArr[3]}
        }
        #panel${openbarClass} .panel-button.candy5 {
            ${candyStyleArr[4]}
        }
        #panel${openbarClass} .panel-button.candy5:hover, #panel${openbarClass} .panel-button.candy5:focus,
        #panel${openbarClass} .panel-button.candy5:active, #panel${openbarClass} .panel-button.candy5:checked {
            ${candyHighlightArr[4]}
        }
        #panel${openbarClass} .panel-button.candy6 {
            ${candyStyleArr[5]}
        }
        #panel${openbarClass} .panel-button.candy6:hover, #panel${openbarClass} .panel-button.candy6:focus,
        #panel${openbarClass} .panel-button.candy6:active, #panel${openbarClass} .panel-button.candy6:checked {
            ${candyHighlightArr[5]}
        }
        #panel${openbarClass} .panel-button.candy7 {
            ${candyStyleArr[6]}
        }
        #panel${openbarClass} .panel-button.candy7:hover, #panel${openbarClass} .panel-button.candy7:focus,
        #panel${openbarClass} .panel-button.candy7:active, #panel${openbarClass} .panel-button.candy7:checked {
            ${candyHighlightArr[6]}
        }
        #panel${openbarClass} .panel-button.candy8 {
            ${candyStyleArr[7]}
        }
        #panel${openbarClass} .panel-button.candy8:hover, #panel${openbarClass} .panel-button.candy8:focus,
        #panel${openbarClass} .panel-button.candy8:active, #panel${openbarClass} .panel-button.candy8:checked {
            ${candyHighlightArr[7]}
        }
        #panel${openbarClass} .panel-button.candy9 {
            ${candyStyleArr[8]}
        }
        #panel${openbarClass} .panel-button.candy9:hover, #panel${openbarClass} .panel-button.candy9:focus,
        #panel${openbarClass} .panel-button.candy9:active, #panel${openbarClass} .panel-button.candy9:checked {
            ${candyHighlightArr[8]}
        }
        #panel${openbarClass} .panel-button.candy10 {
            ${candyStyleArr[9]}
        }
        #panel${openbarClass} .panel-button.candy10:hover, #panel${openbarClass} .panel-button.candy10:focus,
        #panel${openbarClass} .panel-button.candy10:active, #panel${openbarClass} .panel-button.candy10:checked {
            ${candyHighlightArr[9]}
        }
        #panel${openbarClass} .panel-button.candy11 {
            ${candyStyleArr[10]}
        }
        #panel${openbarClass} .panel-button.candy11:hover, #panel${openbarClass} .panel-button.candy11:focus,
        #panel${openbarClass} .panel-button.candy11:active, #panel${openbarClass} .panel-button.candy11:checked {
            ${candyHighlightArr[10]}
        }
        #panel${openbarClass} .panel-button.candy12 {
            ${candyStyleArr[11]}
        }
        #panel${openbarClass} .panel-button.candy12:hover, #panel${openbarClass} .panel-button.candy12:focus,
        #panel${openbarClass} .panel-button.candy12:active, #panel${openbarClass} .panel-button.candy12:checked {
            ${candyHighlightArr[11]}
        }
        #panel${openbarClass} .panel-button.candy13 {
            ${candyStyleArr[12]}
        }
        #panel${openbarClass} .panel-button.candy13:hover, #panel${openbarClass} .panel-button.candy13:focus,
        #panel${openbarClass} .panel-button.candy13:active, #panel${openbarClass} .panel-button.candy13:checked {
            ${candyHighlightArr[12]}
        }
        #panel${openbarClass} .panel-button.candy14 {
            ${candyStyleArr[13]}
        }
        #panel${openbarClass} .panel-button.candy14:hover, #panel${openbarClass} .panel-button.candy14:focus,
        #panel${openbarClass} .panel-button.candy14:active, #panel${openbarClass} .panel-button.candy14:checked {
            ${candyHighlightArr[13]}
        }
        #panel${openbarClass} .panel-button.candy15 {
            ${candyStyleArr[14]}
        }
        #panel${openbarClass} .panel-button.candy15:hover, #panel${openbarClass} .panel-button.candy15:focus,
        #panel${openbarClass} .panel-button.candy15:active, #panel${openbarClass} .panel-button.candy15:checked {
            ${candyHighlightArr[14]}
        }
        #panel${openbarClass} .panel-button.candy16 {
            ${candyStyleArr[15]}
        }
        #panel${openbarClass} .panel-button.candy16:hover, #panel${openbarClass} .panel-button.candy16:focus,
        #panel${openbarClass} .panel-button.candy16:active, #panel${openbarClass} .panel-button.candy16:checked {
            ${candyHighlightArr[15]}
        }    
        #panel${openbarClass} .panel-button.candy1.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy1.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy1.clock-display .clock,
        #panel${openbarClass} .panel-button.candy2.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy2.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy2.clock-display .clock,
        #panel${openbarClass} .panel-button.candy3.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy3.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy3.clock-display .clock,
        #panel${openbarClass} .panel-button.candy4.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy4.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy4.clock-display .clock,
        #panel${openbarClass} .panel-button.candy5.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy5.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy5.clock-display .clock,
        #panel${openbarClass} .panel-button.candy6.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy6.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy6.clock-display .clock,
        #panel${openbarClass} .panel-button.candy7.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy7.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy7.clock-display .clock,
        #panel${openbarClass} .panel-button.candy8.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy8.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy8.clock-display .clock,
        #panel${openbarClass} .panel-button.candy9.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy9.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy9.clock-display .clock,
        #panel${openbarClass} .panel-button.candy10.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy10.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy10.clock-display .clock,
        #panel${openbarClass} .panel-button.candy11.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy11.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy11.clock-display .clock,
        #panel${openbarClass} .panel-button.candy12.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy12.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy12.clock-display .clock,
        #panel${openbarClass} .panel-button.candy13.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy13.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy13.clock-display .clock,
        #panel${openbarClass} .panel-button.candy14.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy14.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy14.clock-display .clock,
        #panel${openbarClass} .panel-button.candy15.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy15.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy15.clock-display .clock,
        #panel${openbarClass} .panel-button.candy16.clock-display .clock, #panel${openbarClass} .panel-button:hover.candy16.clock-display .clock, #panel${openbarClass} .panel-button:checked.candy16.clock-display .clock {
            ${candyClockStyle}
        }            

        #panel${openbarClass} .workspace-dot:candybar {
            ${candyDotStyle}
        }
    `;

    // Menu styles
    stylesheet += `

        ${openmenuClass}.popup-menu-boxpointer, ${openmenuClass}.candidate-popup-boxpointer {
            -arrow-rise: 6px; 
        }

        ${openmenuClass}.popup-menu {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha});
        }

        ${openmenuClass}.popup-menu-content, ${openmenuClass}.candidate-popup-content {
            ${menuContentStyle}
        }
    `;

    stylesheet += `
        ${openmenuClass}.popup-menu-item {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha});
        }
        ${openmenuClass}.popup-menu-item:focus, ${openmenuClass}.popup-menu-item:hover, ${openmenuClass}.popup-menu-item:selected {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1.0) !important;
            background-color: ${mhbg} !important;
            transition-duration: 0ms !important;
        }

        ${openmenuClass}.popup-menu-item:checked, ${openmenuClass}.popup-menu-item:checked:active {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.popup-menu-item:checked:focus, ${openmenuClass}.popup-menu-item:checked:hover, ${openmenuClass}.popup-menu-item:checked:selected,
        ${openmenuClass}.popup-menu-item:checked:active:focus, ${openmenuClass}.popup-menu-item:checked:active:hover, ${openmenuClass}.popup-menu-item:checked:active:selected {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
            box-shadow: none !important;
            background-color: ${mshg} !important;
        }
          
        ${openmenuClass}.popup-menu-item:active, ${openmenuClass}.popup-menu-item.selected:active {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.popup-menu-item:active:hover, ${openmenuClass}.popup-menu-item:active:focus, 
        ${openmenuClass}.popup-menu-item.selected:active:hover, ${openmenuClass}.popup-menu-item.selected:active:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
            background-color: ${mshg} !important;
        }

    `;
        // rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha})
    stylesheet += `
        ${openmenuClass}.popup-sub-menu {
            background-color: ${smbg} !important;
            border: none;
            box-shadow: none;
        }
        
        ${openmenuClass}.popup-sub-menu .popup-menu-item {
            margin: 0px;
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha});
        }
        
        ${openmenuClass}.popup-sub-menu .popup-menu-item:focus, 
        ${openmenuClass}.popup-sub-menu .popup-menu-item:hover, 
        ${openmenuClass}.popup-sub-menu .popup-menu-item:selected {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }
        
        ${openmenuClass}.popup-sub-menu .popup-menu-item:active, 
        ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:active, 
        ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.popup-sub-menu .popup-menu-item:active:hover, ${openmenuClass}.popup-sub-menu .popup-menu-item:active:focus, 
        ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:active:hover, ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:active:focus,
        ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:checked:hover, ${openmenuClass}.popup-sub-menu .popup-submenu-menu-item:checked:focus {
            background-color: ${mshg} !important;
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
        }
    
    
        ${openmenuClass}.popup-menu-section .popup-sub-menu {
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha}) !important;
            border: none;
            box-shadow: none;            
        }
        ${openmenuClass}.popup-menu-section .popup-sub-menu .popup-menu-item {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha});
        }
        ${openmenuClass}.popup-menu-section .popup-sub-menu .popup-menu-item:hover, ${openmenuClass}.popup-menu-section .popup-sub-menu .popup-menu-item:focus,
        ${openmenuClass}.popup-menu-section .popup-sub-menu .popup-menu-item:selected {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }

        ${openmenuClass}.popup-menu-section .popup-menu-item {
            margin: 0px;
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha});
        }
        ${openmenuClass}.popup-menu-section .popup-menu-item:focus, ${openmenuClass}.popup-menu-section .popup-menu-item:hover, 
        ${openmenuClass}.popup-menu-section .popup-menu-item:selected {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1.0) !important;
            background-color: ${mhbg} !important;
        }
        ${openmenuClass}.popup-menu-section .popup-menu-item:active, 
        ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:active, 
        ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.popup-menu-section .popup-menu-item:active:hover, ${openmenuClass}.popup-menu-section .popup-menu-item:active:focus, 
        ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:active:hover, ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:active:focus, 
        ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:checked:hover, ${openmenuClass}.popup-menu-section .popup-submenu-menu-item:checked:focus {
            background-color: ${mshg} !important;
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
        }

        ${openmenuClass}.popup-menu-item .toggle-switch:checked {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1.0) !important;
        }
        ${openmenuClass}.popup-menu-item .button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.popup-menu-item .button:hover, ${openmenuClass}.popup-menu-item .button:focus, ${openmenuClass}.popup-menu-item .button:selected {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
            border-color: transparent !important; 
        }
        ${openmenuClass} .slider{ 
            ${sliderStyle}  
        }
        ${openmenuClass}.popup-separator-menu-item .popup-separator-menu-item-separator, ${openmenuClass}.popup-separator-menu-item .popup-sub-menu .popup-separator-menu-item-separator {
            background-color: rgba(${mbred},${mbgreen},${mbblue},0.7) !important;
        }

    `;

    // rgba(${mhred},${mhgreen},${mhblue},${mhAlpha})
    stylesheet += `
        ${openmenuClass}.datemenu-popover {
            border-radius: ${menuRadius}px !important;
            padding-bottom: ${5 + 0.08*menuRadius}px !important;
        }

        ${openmenuClass}.message-list-placeholder {
            color: rgba(${mfgred},${mfggreen},${mfgblue},0.5) !important;
        }
        ${openmenuClass}.message {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.message:hover, ${openmenuClass}.message:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important; /* 0.9*mhAlpha */
        }
        ${openmenuClass}.message:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},0.5) !important;
        }
        ${openmenuClass}.message .message-title {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        ${openmenuClass}.message .message-source-icon, ${openmenuClass}.message .message-source-title {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.message .message-body {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.message .event-time {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.message:hover .message-source-icon, ${openmenuClass}.message:focus .message-source-icon,
        ${openmenuClass}.message:hover .message-title, ${openmenuClass}.message:focus .message-title,
        ${openmenuClass}.message:hover .message-source-title, ${openmenuClass}.message:focus .message-source-title,
        ${openmenuClass}.message:hover .message-body, ${openmenuClass}.message:focus .message-body,
        ${openmenuClass}.message:hover .event-time, ${openmenuClass}.message:focus .event-time {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
        }
        ${openmenuClass}.message .button, ${openmenuClass}.message .message-close-button, ${openmenuClass}.message .message-expand-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
        }
        ${openmenuClass}.message .button:hover, ${openmenuClass}.message .button:focus,
        ${openmenuClass}.message .message-close-button:hover, ${openmenuClass}.message .message-close-button:focus,
        ${openmenuClass}.message .message-expand-button:hover, ${openmenuClass}.message .message-expand-button:focus {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.message .message-media-control {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        ${openmenuClass}.message .message-media-control:hover, ${openmenuClass}.message .message-media-control:focus {
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important;
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
        }
        ${openmenuClass}.message .message-media-control:insensitive {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.5}) !important;
        }
        ${openmenuClass}.message .media-message-cover-icon .fallback {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.dnd-button {
            border-color: rgba(${mbgred},${mbggreen},${mbgblue},0.5) !important;
            border-radius: 50px;
        }
        ${openmenuClass}.dnd-button:hover {
            border-color: ${mhbg} !important;
        }
        ${openmenuClass}.dnd-button:focus {
            border-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
            box-shadow: none;
        }  
        ${openmenuClass} .toggle-switch {
            background-image: url(media/${toggleOffSVG});
            background-color: transparent !important;
        }
        ${openmenuClass} .toggle-switch:checked {
            background-image: url(media/${toggleOnSVG});
            background-color: transparent !important;
        }
        ${openmenuClass} .check-box StBin {
            background-image: url(media/checkbox-off.svg);
        }
        ${openmenuClass} .check-box:checked StBin {
            background-image: url(media/checkbox-on.svg);
        }
        ${openmenuClass} .check-box:focus StBin {
            background-image: url(media/checkbox-off-focused.svg);
        }  
        ${openmenuClass} .check-box:focus:checked StBin {
            background-image: url(media/checkbox-on-focused.svg);
        } 

        ${openmenuClass}.message-list-clear-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.message-list-clear-button:hover, ${openmenuClass}.message-list-clear-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important; /* 0.9*mhAlpha */
        }
        ${openmenuClass}.message-list-clear-button:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},0.5) !important;
        }

        ${openmenuClass}.datemenu-today-button .date-label, ${openmenuClass}.datemenu-today-button .day-label {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha*1.25}) !important;
        } 
        ${openmenuClass}.datemenu-today-button:hover, ${openmenuClass}.datemenu-today-button:focus {
            background-color: ${mhbg} !important;  /* 0.9*mhAlpha */
            border-radius: ${notifRadius}px;
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
        }

        ${openmenuClass}.calendar {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.calendar .calendar-month-header .pager-button,
        ${openmenuClass}.calendar .calendar-month-header .pager-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${0.5*mbgAlpha}) !important;
        }
        ${openmenuClass}.calendar .calendar-month-header .pager-button:hover,
        ${openmenuClass}.calendar .calendar-month-header .pager-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.calendar .calendar-month-label {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${0.5*mbgAlpha}) !important;
        }
        ${openmenuClass}.calendar-day-heading  {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${0.5*mbgAlpha}) !important;
        }
        ${openmenuClass}.calendar-day-heading:focus  {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: rgba(${smhbgred},${smhbggreen},${smhbgblue},${mhAlpha}) !important;
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.calendar-day {
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${0.5*mbgAlpha}) !important;
        }
        ${openmenuClass}.calendar-weekday, ${openmenuClass}.calendar-work-day {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1) !important;
            font-weight: normal;
        }
        ${openmenuClass}.calendar-nonwork-day, ${openmenuClass}.calendar-weekend {
            color: rgba(${smfgred},${smfggreen},${smfgblue},0.7) !important;
            font-weight: normal;
        }
        ${openmenuClass}.calendar-other-month-day, ${openmenuClass}.calendar-other-month {
            color: rgba(${smfgred},${smfggreen},${smfgblue},0.5) !important;
            font-weight: normal;
        }
        ${openmenuClass}.calendar-other-month-day:hover, ${openmenuClass}.calendar-other-month-day:focus, ${openmenuClass}.calendar-other-month-day:selected,
        ${openmenuClass}.calendar-other-month:hover, ${openmenuClass}.calendar-other-month:focus, ${openmenuClass}.calendar-other-month:selected,
        ${openmenuClass}.calendar-nonwork-day:hover, ${openmenuClass}.calendar-nonwork-day:focus, ${openmenuClass}.calendar-nonwork-day:selected,
        ${openmenuClass}.calendar-work-day:hover, ${openmenuClass}.calendar-work-day:focus, ${openmenuClass}.calendar-work-day:selected,
        ${openmenuClass}.calendar-weekday:hover, ${openmenuClass}.calendar-weekday:focus, ${openmenuClass}.calendar-weekday:selected,
        ${openmenuClass}.calendar-weekend:hover, ${openmenuClass}.calendar-weekend:focus, ${openmenuClass}.calendar-weekend:selected  {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.calendar-other-month-day:focus, ${openmenuClass}.calendar-other-month-day:selected,
        ${openmenuClass}.calendar-other-month:focus, ${openmenuClass}.calendar-other-month:selected,
        ${openmenuClass}.calendar-nonwork-day:focus, ${openmenuClass}.calendar-nonwork-day:selected,
        ${openmenuClass}.calendar-work-day:focus, ${openmenuClass}.calendar-work-day:selected,
        ${openmenuClass}.calendar-weekday:focus, ${openmenuClass}.calendar-weekday:selected,
        ${openmenuClass}.calendar-weekend:focus, ${openmenuClass}.calendar-weekend:selected  {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.calendar .calendar-today, ${openmenuClass}.calendar .calendar-today:selected {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.calendar .calendar-today:hover, ${openmenuClass}.calendar .calendar-today:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
            background-color: ${mshg} !important;
        }
        ${openmenuClass}.calendar .calendar-today:selected, ${openmenuClass}.calendar .calendar-today:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.calendar .calendar-today .calendar-day-with-events, ${openmenuClass}.calendar .calendar-day-with-events {
            background-image: url("media/calendar-today.svg");
            background-size: contain;
        }
        ${openmenuClass}.calendar-week-number {
            font-weight: bold;
            font-feature-settings: "tnum";
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha*0.7}) !important;
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha*0.8}) !important;
        }

        ${openmenuClass}.events-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.events-button:hover, ${openmenuClass}.events-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.events-button:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.events-button .events-list {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }            
        ${openmenuClass}.events-button .events-title {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.9}) !important;
        }            
        ${openmenuClass}.events-button .event-time, ${openmenuClass}.events-button .event-placeholder {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.events-button:hover .events-list, ${openmenuClass}.events-button:focus .events-list,
        ${openmenuClass}.events-button:hover .events-title, ${openmenuClass}.events-button:focus .events-title,
        ${openmenuClass}.events-button:hover .event-time, ${openmenuClass}.events-button:focus .event-time,
        ${openmenuClass}.events-button:hover .event-placeholder, ${openmenuClass}.events-button:focus .event-placeholder {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
        }
        
        ${openmenuClass}.world-clocks-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.world-clocks-button:hover, ${openmenuClass}.world-clocks-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.world-clocks-button:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.world-clocks-button .world-clocks-header, ${openmenuClass}.world-clocks-button .world-clocks-timezone {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.9}) !important;
        }
        ${openmenuClass}.world-clocks-button .world-clocks-city, ${openmenuClass}.world-clocks-button .world-clocks-time {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.world-clocks-button:hover .world-clocks-header, ${openmenuClass}.world-clocks-button:focus .world-clocks-header,
        ${openmenuClass}.world-clocks-button:hover .world-clocks-timezone, ${openmenuClass}.world-clocks-button:focus .world-clocks-timezone,
        ${openmenuClass}.world-clocks-button:hover .world-clocks-city, ${openmenuClass}.world-clocks-button:focus .world-clocks-city,
        ${openmenuClass}.world-clocks-button:hover .world-clocks-time, ${openmenuClass}.world-clocks-button:focus .world-clocks-time {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
        }
       
        ${openmenuClass}.weather-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
            box-shadow: 0 1px 1px 0 rgba(${mshred},${mshgreen},${mshblue},0.08) !important;
        }
        ${openmenuClass}.weather-button:hover, ${openmenuClass}.weather-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.weather-button:focus {
            box-shadow: inset 0 0 0 2px rgba(${msred},${msgreen},${msblue},${0.5}) !important;
        }
        ${openmenuClass}.weather-button .weather-header {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        ${openmenuClass}.weather-button .weather-header.location {
            font-weight: normal;
        }
        ${openmenuClass}.weather-button .weather-forecast-time {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*0.85}) !important;
        }
        ${openmenuClass}.weather-button:hover .weather-header, ${openmenuClass}.weather-button:focus .weather-header,
        ${openmenuClass}.weather-button:hover .weather-header.location, ${openmenuClass}.weather-button:focus .weather-header.location,
        ${openmenuClass}.weather-button:hover .weather-forecast-time, ${openmenuClass}.weather-button:focus .weather-forecast-time {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
        }
    `;

    stylesheet += `
        ${openmenuClass}.quick-settings {
            border-radius: ${menuRadius}px !important;
        }

        ${openmenuClass}.quick-slider .slider{                
            ${sliderStyle}
        }

        ${openmenuClass}.quick-toggle {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            box-shadow: none;
            border-radius: ${qtoggleRadius}px;
        }
        ${openmenuClass}.quick-toggle:hover, ${openmenuClass}.quick-toggle:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }   
        ${openmenuClass}.quick-toggle:checked, ${openmenuClass}.quick-toggle:checked:active, ${openmenuClass}.quick-toggle .button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle:checked:hover, ${openmenuClass}.quick-toggle:checked:focus, 
        ${openmenuClass}.quick-toggle:checked:active:hover, ${openmenuClass}.quick-toggle:checked:active:focus, 
        ${openmenuClass}.quick-toggle .button:checked:hover, ${openmenuClass}.quick-toggle .button:checked:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1) !important;
            background-color: ${mshg} !important;
        }

        ${openmenuClass}.quick-menu-toggle .quick-toggle {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            box-shadow: none;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle:hover, ${openmenuClass}.quick-menu-toggle .quick-toggle:focus {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle:checked, 
        ${openmenuClass}.quick-menu-toggle .quick-toggle:active {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
            box-shadow: none;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle:checked:hover, ${openmenuClass}.quick-menu-toggle .quick-toggle:checked:focus, 
        ${openmenuClass}.quick-menu-toggle .quick-toggle:active:hover, ${openmenuClass}.quick-menu-toggle .quick-toggle:active:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1) !important;
            background-color: ${mshg} !important;
        }
        
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha*1.2}) !important;
            border-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important;
        }
        /* adjust borders in expandable menu button */
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:ltr {
            border-radius: 0 ${qtoggleRadius}px ${qtoggleRadius}px 0;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:rtl {
            border-radius: ${qtoggleRadius}px 0 0 ${qtoggleRadius}px;
        }
        /* adjust borders if quick toggle has expandable menu button (quick-toggle-arrow)[44+] */
        ${openmenuClass}.quick-menu-toggle .quick-toggle:ltr { border-radius: ${qtoggleRadius}px 0 0 ${qtoggleRadius}px; }
        ${openmenuClass}.quick-menu-toggle .quick-toggle:rtl { border-radius: 0 ${qtoggleRadius}px ${qtoggleRadius}px 0; }
        /* if quick toggle has no expandable menu button (quick-toggle-arrow)[44+] */
        ${openmenuClass}.quick-menu-toggle .quick-toggle:last-child {
            border-radius: ${qtoggleRadius}px;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:hover, ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha*1.2}) !important;
        }
        ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:checked:hover, ${openmenuClass}.quick-menu-toggle .quick-toggle-arrow:checked:focus {
            background-color: ${mshg} !important;
        }

        ${openmenuClass}.quick-toggle-menu {
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .popup-menu-item {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .popup-menu-item:hover, ${openmenuClass}.quick-toggle-menu .popup-menu-item:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }

        ${openmenuClass}.quick-toggle-menu .popup-menu-item:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha*1.2}) !important;
        }            
        ${openmenuClass}.quick-toggle-menu .popup-menu-item:checked:focus, ${openmenuClass}.quick-toggle-menu .popup-menu-item:checked:hover, 
        ${openmenuClass}.quick-toggle-menu .popup-menu-item:checked:selected {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1) !important;
            background-color: ${mshg} !important;
        }
        ${openmenuClass}.quick-toggle-menu .header .title, ${openmenuClass}.quick-toggle-menu .header .subtitle  {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .header .icon {
            color: rgba(${amfgred},${amfggreen},${amfgblue},${mfgAlpha}) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .icon-button {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .icon-button:hover, ${openmenuClass}.quick-toggle-menu .icon-button:focus {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${mhbgred},${mhbggreen},${mhbgblue},${mbgAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .icon-button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.quick-toggle-menu .icon-button:checked:hover, ${openmenuClass}.quick-toggle-menu .icon-button:checked:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},${mfgAlpha*1.2}) !important;
            background-color: ${mshg} !important;
        }

        ${openmenuClass}.quick-settings-system-item .icon-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha*1.2}) !important;
        }
        ${openmenuClass}.quick-settings .icon-button, ${openmenuClass}.quick-settings .button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha*1.2}) !important;
        }        
        ${openmenuClass}.quick-settings .icon-button:checked, ${openmenuClass}.quick-settings .button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        } 
        ${openmenuClass}.background-app-item .icon-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha*1.2}) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha*1.2}) !important;
        }

        ${openmenuClass}.quick-settings-system-item .icon-button:hover, ${openmenuClass}.quick-settings-system-item .icon-button:focus,
        ${openmenuClass}.quick-settings .icon-button:hover, ${openmenuClass}.quick-settings .icon-button:focus,
        ${openmenuClass}.quick-settings .button:hover, ${openmenuClass}.quick-settings .button:focus,
        ${openmenuClass}.background-app-item .icon-button:hover, ${openmenuClass}.background-app-item .icon-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
            background-color: ${smhbg} !important;
        }
        
        ${openmenuClass}.quick-settings .button:checked:hover, ${openmenuClass}.quick-settings .button:checked:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1) !important;
            background-color: ${mshg} !important;
        }

        ${openmenuClass}.quick-settings-system-item .power-item:checked {
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.nm-network-item:checked, ${openmenuClass}.nm-network-item:active {
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }          
        ${openmenuClass}.bt-device-item:checked {
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.keyboard-brightness-level .button:checked {
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
        ${openmenuClass}.background-apps-quick-toggle:checked {
            background-color: rgba(${msred},${msgreen},${msblue},${msAlpha}) !important;
        }
    `;

    //== BEYOND BAR ==//

    function shadeAccent(transparentize, shade) {
        return colorShade(`rgba(${msred},${msgreen},${msblue},${transparentize*msAlpha})`, shade);
    }
    function shadeMbg(transparentize, shade) {
        return colorShade(`rgba(${mbgred},${mbggreen},${mbgblue},${transparentize*mbgAlpha})`, shade);
    }
    function shadeSMbg(transparentize, shade) {
        return colorShade(`rgba(${smbgred},${smbggreen},${smbgblue},${transparentize*mbgAlpha})`, shade);
    }

    // Shell St Entry Base colors
    let baseBgColor = darkMode? 'rgba(75, 75, 75, 0.8)' : 'rgba(200, 200, 200, 0.8)';
    let baseFgColor = darkMode? 'rgb(255, 255, 255)' : 'rgb(25, 25, 25)';
    let baseHintFgColor = darkMode? 'rgba(255, 255, 255, 0.7)' : 'rgba(25, 25, 25, 0.7)';

    // let accentColor = `rgba(${msred},${msgreen},${msblue},${msAlpha})`;
    let applyAccentShell, applyMenuNotif, dashDockStyle;
    applyAccentShell = obar._settings.get_boolean('apply-accent-shell');
    applyMenuNotif = obar._settings.get_boolean('apply-menu-notif');
    dashDockStyle = obar._settings.get_string('dashdock-style');

    let tooltipBgRed = 0.8*mbgred + 0.2*(255 - mfgred);
    let tooltipBgGreen = 0.8*mbggreen + 0.2*(255 - mfggreen);
    let tooltipBgBlue = 0.8*mbgblue + 0.2*(255 - mfgblue);

    if(applyAllShell) {
        applyMenuNotif = true;
        applyMenuShell = true;
        applyAccentShell = true;        
    }


    /* Common Stylings */
    if(applyAccentShell) {
        stylesheet += `    
        .slider{                
            ${sliderStyle}
        }
        .toggle-switch {
            background-image: url(media/${toggleOffSVG});
            background-color: transparent !important;
        }
        .toggle-switch:checked {
            background-image: url(media/${toggleOnSVG});
            background-color: transparent !important;
        }
        .check-box StBin {
            background-image: url(media/checkbox-off.svg);
        }
        .check-box:checked StBin {
            background-image: url(media/checkbox-on.svg);
        }
        .check-box:focus StBin {
            background-image: url(media/checkbox-off-focused.svg);
        }  
        .check-box:focus:checked StBin {
            background-image: url(media/checkbox-on-focused.svg);
        } `;
    }

    if(applyAllShell) {
        stylesheet += `
        .workspace-switcher, .resize-popup, .osd-monitor-label {
            box-shadow: 0 5px 10px 0 rgba(${mshred},${mshgreen},${mshblue},${mshAlpha}) !important; /* menu shadow */
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha}) !important; /* menu bg */
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha}) !important; /* menu fg */ 
            border-color: rgba(${mbred},${mbgreen},${mbblue},${mbAlpha}) !important;
        } `;
    }
        

    /* a11y */
    if(applyAccentShell) {
        stylesheet += `
        /* Location and Activities Ripple */
        .ripple-pointer-location, .ripple-box {
            background-color: ${shadeAccent(0.7, 0.3)} !important;
            box-shadow: 0 0 2px 2px ${shadeAccent(1, 0.1)} !important;
        }

        .pie-timer {
            -pie-border-color: ${msc} !important;
            -pie-background-color: ${shadeAccent(0.7, 0.3)} !important;
        }

        .magnifier-zoom-region {
            border-color: ${msc} !important;
        } `;
    }

    /* app-grid */
    if(applyAccentShell) {
        stylesheet += `
        .overview-tile {
            background-color: transparent;
        }
        .overview-tile:active, .overview-tile:checked,
        .app-well-app:active .overview-icon, .app-well-app:checked .overview-icon 
        .show-apps:active .overview-icon, .show-apps:checked .overview-icon, 
        .grid-search-result:active .overview-icon, .grid-search-result:checked .overview-icon {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }
        StWidget.focused .app-well-app-running-dot, StWidget.focused .show-apps-running-dot, StWidget.focused .app-grid-running-dot {
            background-color: rgba(${msred},${msgreen},${msblue}, 1.0) !important;
            border-color: rgba(${msred},${msgreen},${msblue}, 1.0) !important;
        } `;
    }

    if(applyAllShell) {
        stylesheet += `
        .overview-tile, .app-well-app .overview-icon, .show-apps .overview-icon, .grid-search-result .overview-icon {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) ;
            border-radius: ${menuRadius}px;
            /*background-color: transparent; Removes default focus from first search result*/
        }
        .overview-tile:hover, .app-well-app:hover .overview-icon, .grid-search-result:hover .overview-icon {
            background-color: rgba(${smhbgred},${smhbggreen},${smhbgblue},${0.95*mbgAlpha}) ;
            transition-duration: 100ms;
        }
        .overview-tile:focus, .overview-tile:selected,
        .app-well-app:focus .overview-icon, .app-well-app:selected .overview-icon
        .grid-search-result:focus .overview-icon, .grid-search-result:selected .overview-icon {
            background-color: ${smhbg} ;
            transition-duration: 100ms;
        }   
        .app-well-app.app-folder .overview-icon, .overview-tile.app-folder,
        .app-folder.grid-search-result .overview-icon {    
            background-color: rgba(${smfgred},${smfggreen},${smfgblue},0.08);   
        }
        .app-well-app.app-folder:hover .overview-icon, .app-well-app.app-folder:focus .overview-icon, 
        .overview-tile.app-folder:hover, .overview-tile.app-folder:focus, 
        .app-folder.grid-search-result:hover .overview-icon, .app-folder.grid-search-result:focus .overview-icon {    
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) ;
            background-color: ${smhbg} ;   
        }
        .app-folder-dialog {
            background-color: ${smbg} !important;
            color: rgba(${smfgred},${smfggreen},${smfgblue},1) !important;
        }
        .app-folder-dialog .folder-name-container .folder-name-label {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1) !important;
        }
        .app-folder-dialog .folder-name-container .edit-folder-button,
        .app-folder-dialog .folder-name-container .icon-button {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
            background-color: ${mbg} !important;
        }
        .app-folder-dialog .folder-name-container .edit-folder-button:hover, 
        .app-folder-dialog .folder-name-container .edit-folder-button:focus,
        .app-folder-dialog .folder-name-container .icon-button:hover, 
        .app-folder-dialog .folder-name-container .icon-button:focus {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
            background-color: ${mhbg} !important;
        }
        .app-folder-dialog .folder-name-container .edit-folder-button:active,
        .app-folder-dialog .folder-name-container .edit-folder-button:checked,
        .app-folder-dialog .folder-name-container .icon-button:active,
        .app-folder-dialog .folder-name-container .icon-button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }

        .app-well-app-running-dot, .app-grid-running-dot {
            background-color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            border: 2px solid rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
        }
        
        .page-indicator .page-indicator-icon {
            color: transparent;
            background-color: rgba(${smfgred},${smfggreen},${smfgblue},1) !important;
        }
        /*.page-indicator:hover .page-indicator-icon {
            background-color: rgba(${smfgred},${smfggreen},${smfgblue},0.5) !important;
        }
        .page-indicator:active .page-indicator-icon, .page-indicator:checked .page-indicator-icon {
            background-color: rgba(${smfgred},${smfggreen},${smfgblue},0.9) !important;
        }*/ `;
    }

    /* App Switcher */
    if(applyAccentShell) {
        stylesheet += `
        .switcher-list .item-box:active {
            background-color: rgba(${msred},${msgreen},${msblue}, 0.9) !important;
        }
        .cycler-highlight {
            border: 5px solid rgba(211,141,75,0.9);
        } `;
    }

    if(applyAllShell) {
        stylesheet += `
        .switcher-list {
            ${menuContentStyle}
        }
        .switcher-list .item-box {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
            background-color: transparent;
        }
        .switcher-list .item-box:hover, .switcher-list .item-box:selected {
            background-color: ${mhbg} !important;
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
        }         
        .switcher-arrow {
            border-color: rgba(${mfgred},${mfggreen},${mfgblue},0.8) !important; 
            color: rgba(${mfgred},${mfggreen},${mfgblue},0.8) !important; 
        } `;
    }

    /* Search */
    if(applyAllShell) {
        stylesheet += `
        .search-section-content {
            background-color: ${mbg} !important;
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
            border-radius: ${menuRadius}px;
            border: 2px solid transparent;
        }
        /*.search_section_content_item:hover, .search_section_content_item:focus {
            background-color: ${smhbg} !important;
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1) !important;
        }*/
        .search-provider-icon .list-search-provider-content .list-search-provider-details {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
        }
        .search-provider-icon {
            background-color: transparent;
        }
        .search-provider-icon:hover, .search-provider-icon:focus {
            background-color: ${mhbg} !important;
        }
        .search-provider-icon:hover .list-search-provider-content .list-search-provider-details, 
        .search-provider-icon:focus .list-search-provider-content .list-search-provider-details {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
        }
        .search-statustext {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1) !important;
        }
        .list-search-result .list-search-result-title, .list-search-result .list-search-result-content {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
        }
        .list-search-result .list-search-result-description {
            color: rgba(${mfgred},${mfggreen},${mfgblue},0.65) !important;
        }
        .list-search-result:hover .list-search-result-title, .list-search-result:focus .list-search-result-title,
        .list-search-result:hover .list-search-result-content, .list-search-result:focus .list-search-result-content {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1) !important;
        }
        .list-search-result:hover .list-search-result-description, .list-search-result:focus .list-search-result-description {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},0.65) !important;
        }
        .list-search-result {
            background-color: transparent;
        }
        .list-search-result:hover, .list-search-result:focus {
            background-color: ${mhbg} !important;
        } `;
    }

    /* Workspace Overview and Workspace Switcher */
    if(applyAccentShell) {
        stylesheet += `
        .workspace-thumbnail-indicator {
            border: 3px solid ${msc} !important;
        } 
        StEntry .search-entry:hover, StEntry .search-entry:focus {
            border-color: ${msc} !important;
        } `;
    }
    if(applyAllShell) {
        stylesheet += `
        .workspace-thumbnails .workspace-thumbnail:hover, .workspace-thumbnails .workspace-thumbnail:focus {
            border: 2px solid ${mhbg} !important;
        } 
        StEntry .search-entry {
            border-color: rgba(${smfgred},${smfggreen},${smfgblue},0.7) !important;
        }
        .system-action-icon {
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
        }
        /*.workspace-background {
            box-shadow: 0 4px 16px 4px rgba(${smfgred}, ${smfggreen}, ${smfgblue}, 0.275); 
        } Dark shadow is better */   
        .window-caption { /* window tooltip */
            box-shadow: 0 2px 0 0 rgba(${mshred},${mshgreen},${mshblue}, 0.25) !important; /* menu shadow */
            background-color: rgba(${tooltipBgRed},${tooltipBgGreen},${tooltipBgBlue}, 0.85) !important; /* menu bg */
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha}) !important; /* menu fg */ 
            border-color: transparent !important;
        }
        .window-close {
            background-color: rgba(${tooltipBgRed},${tooltipBgGreen},${tooltipBgBlue}, 0.8) !important;
            color: rgba(${mfgred},${mfggreen},${mfgblue}, 1) !important;
        }
        .ws-switcher-indicator {
            background-color: rgba(${mfgred},${mfggreen},${mfgblue},0.65) !important;
        }
        .ws-switcher-indicator:active {
            background-color: rgba(${mfgred},${mfggreen},${mfgblue}, 1) !important;
        } `;
    }

    /* Dash / Dock => Options in settings  */
    let dashBgColor, dashFgColor, dashBorderColor, dashShadowColor, dashHighlightColor;
    if(dashDockStyle == 'Menu') {
        dashBgColor = `rgba(${mbgred},${mbggreen},${mbgblue},${mbgAlpha})`;
        dashFgColor = `rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha})`;
        dashBorderColor = `rgba(${mbred},${mbgreen},${mbblue},${mbAlpha})`;
        dashShadowColor = `rgba(${mshred},${mshgreen},${mshblue},${mshAlpha})`;
        dashHighlightColor = mhbg;
    }
    else if(dashDockStyle == 'Bar') {
        if(bartype == 'Mainland' || bartype == 'Floating') {
            dashBgColor = `rgba(${bgred},${bggreen},${bgblue},${bgalpha})`;
            dashHighlightColor = phbg;
        }
        else {
            dashBgColor = `rgba(${isred},${isgreen},${isblue},${isalpha})`;
            dashHighlightColor = ihbg;
        }
        dashFgColor = `rgba(${fgred},${fggreen},${fgblue},${fgalpha})`;
        dashBorderColor = `rgba(${bred},${bgreen},${bblue},${balpha})`;
        dashShadowColor = `rgba(${mshred},${mshgreen},${mshblue},${mshAlpha})`;        
    }
    else if(dashDockStyle == 'Custom') {
        dashBgColor = `rgba(${dbgred},${dbggreen},${dbgblue},${dbgAlpha})`;
        let bgDark = getBgDark(dbgred, dbggreen, dbgblue);
        let dfgred, dfggreen, dfgblue;
        if(bgDark) {
            dfgred = dfggreen = dfgblue = 250;
        }
        else {
            dfgred = dfggreen = dfgblue = 20;
        }
        dashFgColor = `rgba(${dfgred},${dfggreen},${dfgblue},1.0)`;
        dashBorderColor = `rgba(${mbred},${mbgreen},${mbblue},${mbAlpha})`;
        dashShadowColor = `rgba(${mshred},${mshgreen},${mshblue},${mshAlpha})`;
        let hgColor = getAutoHgColor([dbgred,dbggreen,dbgblue]);   
        // Custom Highlight RGB   
        let chred = dbgred*(1-hAlpha) + hgColor[0]*hAlpha;
        let chgreen = dbggreen*(1-hAlpha) + hgColor[1]*hAlpha;
        let chblue = dbgblue*(1-hAlpha) + hgColor[2]*hAlpha;
        dashHighlightColor = `rgba(${chred},${chgreen},${chblue},${dbgAlpha})`;
    }    
    
    if(dashDockStyle != 'Default') {
        dashBorderColor = dBorder? dashBorderColor : 'transparent';
        dashShadowColor = dShadow? dashShadowColor : 'transparent';

        stylesheet += `
        .dash-background {
            background-color: ${dashBgColor} !important;
            color: ${dashFgColor} !important;
            border: 1px solid ${dashBorderColor} !important;
            box-shadow: 0 5px 10px 0 ${dashShadowColor} !important;
            border-radius: ${dbRadius}px !important;
        }
        #dashtodockContainer.left #dash .dash-background, #dashtodockContainer.right #dash .dash-background,
        #dashtodockContainer.top #dash .dash-background, #dashtodockContainer.bottom #dash .dash-background {
            border-radius: ${dbRadius}px !important;
        }
        .dash-separator {
            background-color: ${dashBorderColor} !important;
            box-shadow: 1px 1px 0px rgba(25,25,25,0.1) !important;
        }
        .dash-item-container .app-well-app .overview-icon, .dash-item-container .overview-tile .overview-icon, .dash-item-container .show-apps .overview-icon {
            color: ${dashFgColor} !important;
            background-color: transparent !important;
        }
        .dash-item-container .overview-tile, .dash-item-container .overview-tile:hover, .dash-item-container .overview-tile.focused, .dash-item-container .overview-tile:active {
            background-color: transparent !important;
        }
        .dash-item-container .app-well-app:active .overview-icon, 
        .dash-item-container .overview-tile:active .overview-icon, 
        .dash-item-container .show-apps:active .overview-icon {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }
        .dash-item-container .app-well-app:hover .overview-icon, .dash-item-container .app-well-app.focused .overview-icon,
        .dash-item-container .overview-tile:hover .overview-icon, .dash-item-container .overview-tile.focused .overview-icon,
        .dash-item-container .show-apps:hover .overview-icon, .dash-item-container .show-apps.focused .overview-icon {
            background-color: ${dashHighlightColor} !important; 
        }
        .dash-label { /* app-icon tooltip */
            background-color: rgba(${tooltipBgRed},${tooltipBgGreen},${tooltipBgBlue}, 0.9) !important;
            color: rgba(${mfgred},${mfggreen},${mfgblue},1) !important;
            box-shadow: 0 2px 0 0 rgba(${mshred},${mshgreen},${mshblue}, 0.25) !important; /* menu shadow */
            border-color: transparent !important;
        } 
        
        #dash StIcon { 
            height: ${dIconSize}px !important; 
            width: ${dIconSize}px !important; 
        }
        #dash .app-well-app-running-dot, #dash .app-grid-running-dot, #dash .show-apps-running-dot {
            height: ${dIconSize/15.0}px;
            width: ${dIconSize/15.0}px;
            border-radius: ${dIconSize/15.0}px;
            background-color: ${dashFgColor} !important;
            border: 2px solid ${dashFgColor} !important;
        } 
        #dash StWidget.focused .app-well-app-running-dot, #dash StWidget.focused .app-grid-running-dot, #dash StWidget.focused .show-apps-running-dot {
            background-color: rgba(${msred},${msgreen},${msblue}, 1.0) !important;
            border-color: rgba(${msred},${msgreen},${msblue}, 1.0) !important;
            box-shadow: 0 0 2px rgba(225,225,225,0.5) !important;
        }
        
        /*.show-apps:hover .overview-icon, .show-apps:focus .overview-icon, .show-apps:selected .overview-icon {
            color:${dashFgColor} !important;
            background-color: ${dashHighlightColor} !important;
        }*/
        `;
    }


    /* Modal Dialogs  .end-session-dialog, .message-dialog-content, .run-dialog, .prompt-dialog, */
    if(applyAccentShell) {
        stylesheet += `
        .modal-dialog-linked-button:focus, .modal-dialog-linked-button:selected {
            border-color: ${msc} !important;
            box-shadow: none !important;
        }
        .audio-selection-device:active {
            background-color: ${msc} !important;
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
        }
        .nm-dialog-item:selected {
            background-color: ${msc} !important;
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important; 
        } `;
    }
    
    if(applyAllShell) {
        stylesheet += `
        .modal-dialog  {
            ${menuContentStyle}
        }
        .dialog-list .dialog-list-box {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        }
        .dialog-list .dialog-list-box .dialog-list-item:hover {
            background-color: ${smhbg} !important;
        }
        .dialog-list .dialog-list-box .dialog-list-item .dialog-list-item-title {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
        }
        .dialog-list .dialog-list-box .dialog-list-item .dialog-list-item-description {
            color: rgba(${smfgred},${smfggreen},${smfgblue},0.85) !important;
        }
        .modal-dialog-linked-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
            border: 2px solid transparent;
        }
        .modal-dialog-linked-button:hover {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
            box-shadow: none !important;
        }
        .modal-dialog-linked-button:focus, .modal-dialog-linked-button:selected {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
            /*border-color: ${msc} !important;
            box-shadow: none !important;*/
        }

        .audio-selection-device:hover, .audio-selection-device:focus {
            background-color: ${mhbg} !important;
        }

        .run-dialog .run-dialog-description {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1.0) !important; 
        }

        .caps-lock-warning-label, 
        .prompt-dialog-error-label,
        .polkit-dialog-user-layout .polkit-dialog-user-root-label,
        .end-session-dialog .end-session-dialog-battery-warning,
        .end-session-dialog .dialog-list-title,
        .conflicting-session-dialog-content .conflicting-session-dialog-desc-warning {
            color: rgba(${warningRed},${warningGreen},${warningBlue}, 1) !important;
            background-color: rgba(25, 25, 25, 0.6) !important;
            border-radius: 5px;
            padding: 4px;
            margin: 2px;
        }

        .nm-dialog-subheader {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1.0) !important; 
        }
        .nm-dialog-scroll-view {
            background-color: ${smbg} !important; 
        }

        .nm-dialog-item {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important; 
        }
        .nm-dialog-item:hover {
            background-color: ${smhbg} !important; 
        }

        .no-networks-label {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important; 
        }
        .nm-dialog-airplane-box, .nm-dialog-airplane-text {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important; 
        } `;
    }
          
    /* Login Dialog */
    if(applyAccentShell) {
        stylesheet += `
        .login-dialog .modal-dialog-button, .unlock-dialog .modal-dialog-button {
            border-color: ${msc} !important;
        }
        .login-dialog StEntry:focus, .unlock-dialog StEntry:focus {
            border-color: ${msc} !important;
        }
        .login-dialog-user-list:expanded .login-dialog-user-list-item:selected {
            background-color: ${msc} !important;
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important; 
        }
        .login-dialog-user-list:expanded .login-dialog-user-list-item:logged-in {
            border-right: 2px solid ${msc} !important;
        } 
        .login-dialog-user-list-view .login-dialog-user-list .login-dialog-user-list-item:logged-in .user-icon {
            border-color: ${msc} !important;
        }
        .user-icon.user-avatar {
            box-shadow:inset 0 0 0 1px rgba(${amfgred},${amfggreen},${amfgblue},0.5) !important;
        }
        .unlock-dialog .user-widget .user-icon {
            background-color: ${msc} !important;
        } `;
    }

    /* Entries */
    if(applyAccentShell) {
        stylesheet += `
        StEntry {
            selection-background-color: ${msc} !important;
            selected-color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important; 
            border: 1px solid transparent !important;
        }
        StEntry:hover, StEntry:focus {
            border-color: ${msc} !important;
            box-shadow: none;
        }
        StEntry:active, StEntry:checked {
            border-color: ${msc} !important;
            box-shadow: none;
        } `;
    }
    if(applyAllShell) {
        stylesheet += `
        StEntry {
            color: ${baseFgColor} !important;
            background-color: ${baseBgColor} !important;
        }
        StLabel.hint-text {
            color: ${baseHintFgColor} !important;
        } `;
    }

    let mbgShade = getBgDark(mbgred, mbggreen, mbgblue)? -1: 1;

    /* On-screen Keyboard */
    if(applyAccentShell) {
        stylesheet += `
        .keyboard-key.enter-key {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important; 
            background-color: ${msc} !important;
        }
        .keyboard-key.enter-key:focus, .keyboard-key.enter-key:hover {
            background-color: ${mshg} !important;
        }
        .keyboard-key.enter-key:checked, .keyboard-key.enter-key:active {
            background-color: ${shadeAccent(0.9, 0.3)} !important;
        } `;
    }
    if(applyAllShell) {
        stylesheet += `    
        #keyboard {
            background-color: ${shadeMbg(0.9, 0.2*mbgShade)} !important;            
        }
        .keyboard-key {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${shadeSMbg(1, -0.2*mbgShade)} !important;
        }
        .keyboard-key:focus, .keyboard-key:focus:hover, .keyboard-key:focus:active {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }
        .keyboard-key:hover {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }
        .keyboard-key:active {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        }
        .keyboard-key:checked {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        }
        .keyboard-key.default-key {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important; 
            background-color: ${smbg} !important;
        }
        .keyboard-key:grayed {
            background-color: rgb(125, 125, 125) !important;
        }               
        .keyboard-key.shift-key-uppercase:checked, .keyboard-key.shift-key-uppercase:active {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }
        .keyboard-key.shift-key-uppercase:focus, .keyboard-key.shift-key-uppercase:hover {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }
        .keyboard-subkeys {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            -arrow-background-color: ${shadeMbg(0.9, 0.2*mbgShade)} !important;
        } `;
    }

    /* Looking Glass */
        /* #LookingGlassDialog {
            color: rgba(${mfgred},${mfggreen},${mfgblue},${mfgAlpha});
            background-color: ${mbg} !important;            
        }*/
    if(applyAllShell) {
        stylesheet += `
        #Toolbar .lg-toolbar-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        }
        #Toolbar .lg-toolbar-button:hover, #Toolbar .lg-toolbar-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        } 
        #Toolbar .lg-toolbar-button:active, #Toolbar .lg-toolbar-button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }`;
    }

    /* Overview */
    /* Workspace animation */
    /* Tiled window previews */
    if(applyAllShell) {
        stylesheet += `
        #overviewGroup {
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},1.0) !important; 
        }
        .workspace-animation {
            background-color: ${smbg} ;
        }    
        .tile-preview {
            background-color: rgba(${mbgred},${mbggreen},${mbgblue},0.6) !important;
            border: 1px solid rgba(${mbgred},${mbggreen},${mbgblue},1.0) !important;
        } `;
    }        

    /* Notifications & Message Tray - chat bubbles?? */
    if(applyMenuNotif) {
        stylesheet += `
        .notification-banner {
            color: rgba(${smfgred},${smfggreen},${smfgblue},${mfgAlpha}) !important;
            background-color: ${smbg} !important;
            border-radius: ${notifRadius}px;
        }
        .notification-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: rgba(${smbgred},${smbggreen},${smbgblue},${mbgAlpha}) !important;
        }
        .notification-button:hover, .notification-button:focus, .notification-button:selected {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
            border-color: transparent !important; 
        }
        .summary-source-counter {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        } `;
    }

    /* OSD Window */
    if(applyAllShell) {
        stylesheet += `
        .osd-window, .pad-osd-window {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        } `;
    }

    /* Screenshot UI */
    if(applyAccentShell) {
        stylesheet += `
        .screenshot-ui-type-button:active, .screenshot-ui-type-button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }
        .screenshot-ui-type-button:active:hover, .screenshot-ui-type-button:checked:hover,
        .screenshot-ui-type-button:active:focus, .screenshot-ui-type-button:checked:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
            background-color: ${mshg} !important;
        }
        .screenshot-ui-show-pointer-button:active, .screenshot-ui-show-pointer-button:checked,
        .screenshot-ui-shot-cast-button:active, .screenshot-ui-shot-cast-button:checked {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        }
        .screenshot-ui-show-pointer-button:active:hover, .screenshot-ui-show-pointer-button:checked:hover,
        .screenshot-ui-show-pointer-button:active:focus, .screenshot-ui-show-pointer-button:checked:focus,
        .screenshot-ui-shot-cast-button:active:hover, .screenshot-ui-shot-cast-button:checked:hover,
        .screenshot-ui-shot-cast-button:active:focus, .screenshot-ui-shot-cast-button:checked:focus {
            color: rgba(${amhfgred},${amhfggreen},${amhfgblue},1.0) !important;
            background-color: ${mshg} !important;
        } 
        .screenshot-ui-window-selector-window:hover .screenshot-ui-window-selector-window-border {
            border-color: ${msc} !important;
        }
        .screenshot-ui-window-selector-window:checked .screenshot-ui-window-selector-window-border {
            border-color: ${msc} !important;
            background-color: rgba(${msred},${msgreen},${msblue},0.2) !important;
        }  
        .screenshot-ui-window-selector-window:checked .screenshot-ui-window-selector-check {
            color: rgba(${amfgred},${amfggreen},${amfgblue},1.0) !important;
            background-color: ${msc} !important;
        } `;
    }
    if(applyAllShell) {
        stylesheet += `
        .screenshot-ui-panel {
            ${menuContentStyle}
        }
        .screenshot-ui-type-button, .screenshot-ui-close-button {
            color: rgba(${smfgred},${smfggreen},${smfgblue},1.0) !important;
            background-color: ${smbg} !important;
        }
        .screenshot-ui-type-button:hover, .screenshot-ui-type-button:focus,
        .screenshot-ui-close-button:hover, .screenshot-ui-close-button:focus {
            color: rgba(${smhfgred},${smhfggreen},${smhfgblue},1.0) !important;
            background-color: ${smhbg} !important;
        }        
        .screenshot-ui-show-pointer-button {
            color: rgba(${mfgred},${mfggreen},${mfgblue},1.0) !important;
            background-color: transparent;
        }   
        .screenshot-ui-capture-button:hover, .screenshot-ui-capture-button:focus {
            border-color: ${msc} !important;
        }
        .screenshot-ui-capture-button:cast .screenshot-ui-capture-button-circle {
            background-color: rgba(${destructRed},${destructGreen},${destructBlue},1.0) !important;
        }
        .screenshot-ui-show-pointer-button:hover, .screenshot-ui-show-pointer-button:focus,
        .screenshot-ui-shot-cast-button:hover, .screenshot-ui-shot-cast-button:focus {
            color: rgba(${mhfgred},${mhfggreen},${mhfgblue},1.0) !important;
            background-color: ${mhbg} !important;
        }        
        .screenshot-ui-tooltip {
            box-shadow: 0 2px 0 0 rgba(${mshred},${mshgreen},${mshblue}, 0.25) !important; /* menu shadow */
            background-color: rgba(${tooltipBgRed},${tooltipBgGreen},${tooltipBgBlue}, 0.85); /* menu bg */
            color: rgba(${mfgred},${mfggreen},${mfgblue},1.0); /* menu fg */ 
            border-color: transparent !important;
        }

        /* Rubberband for select-area screenshots */
        .select-area-rubberband {
            background-color: rgba(${mfgred},${mfggreen},${mfgblue},0.6) !important;
            border: 1px solid rgba(${mfgred},${mfggreen},${mfgblue},1.0) !important;
        } `;

        // .screenshot-ui-area-selector .screenshot-ui-area-indicator-selection {
        //     border: 2px white; }          
        // .screenshot-ui-area-selector-handle {
        //     border-radius: 99px;
        //     background-color: white;
        //     box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.2);
        //     width: 24px;
        //     height: 24px; }
    }
    
    let stylepath = Me.path + '/stylesheet.css';
    let file = Gio.File.new_for_path(stylepath);
    let bytearray = new TextEncoder().encode(stylesheet);

    if (bytearray.length) {
        let output = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let outputStream = Gio.BufferedOutputStream.new_sized(output, 4096);
        outputStream.write_all(bytearray, null);
        outputStream.close(null);
    }
    else {
      console.log("Failed to write stylsheet file: " + stylepath);
    }
    
    if(obar.msSVG) { // Accent color is changed
        saveToggleSVG('on', obar, Me); 
        saveToggleSVG('on-hc', obar, Me); 
        saveCheckboxSVG('on', obar, Me);
        saveCheckboxSVG('on-focused', obar, Me);
        obar.msSVG = false;
    }

    if(obar.mhSVG) { // Highlight color is changed
        saveCheckboxSVG('on-focused', obar, Me);
        saveCheckboxSVG('off-focused', obar, Me);
        obar.mhSVG = false;
    }

    if(obar.smfgSVG) { // Foreground color is changed
        saveCalEventSVG(obar, Me);
        obar.smfgSVG = false;
    }

    if(obar.gtkCSS) { // accent or Gtk/Flatpak settings changed
        saveGtkCss(obar, 'enable');
        obar.gtkCSS = false;
    }

}

function reloadStyle(obar, Me) { 
    const importExport = obar._settings.get_boolean('import-export');
    const pauseStyleReload = obar._settings.get_boolean('pause-reload');
    if(importExport || pauseStyleReload)
        return;
    // console.log('reloadStyle called with ImportExport false, Pause false');
    // Save stylesheet from string to css file
    saveStylesheet(obar, Me);
    
    // Cause stylesheet to reload by toggling 'reloadstyle'
    let reloadstyle = obar._settings.get_boolean('reloadstyle');
    if(reloadstyle)
        obar._settings.set_boolean('reloadstyle', false);
    else
        obar._settings.set_boolean('reloadstyle', true);
}
