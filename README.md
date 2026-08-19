
# Waiting Room
Before you explore this repository, [please take a ticket](https://the-window.cre0.org)



# PLEASE STAY NEAR THE WINDOW

A small, branching browser artwork built from the principles in [DESIGN.md](DESIGN.md).


## Local memory

The artwork stores three integers in browser localStorage: visit count, completed encounter count, and requests remembered by the changing window. A browser profile and this origin act as the device boundary; the work does not fingerprint hardware or assign a network identity.

Each full page load adds one request and changes at most one logical pixel. The service window needs 3,765 requests to become a black institutional Dell monitor. The completed monitor stays black for 100 further requests. A corrupted blue-screen message then needs 2,183 more one-pixel requests to finish appearing.

No memory leaves the browser. There is no server database, analytics, or cross-device tracking. Use the quiet **forget this device** control in the lower-right corner to erase the complete local record.

## Tests

Run the deterministic progression tests with:

```sh
node --test tests/*.test.js
```

## Hidden record

The artist's statement exists somewhere inside the artwork as a direct Markdown link.

## License

PLEASE STAY NEAR THE WINDOW is licensed under [CC BY-NC 4.00](https://creativecommons.org/licenses/by-nc/4.0/)

**You are free to:**
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material
  
**Under the following terms:**
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. 
- NonCommercial — You may not use the material for commercial purposes.

Full terms are available at [LICENSE](LICENSE) and at [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)
