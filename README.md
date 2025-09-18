reposition
==========

Convert positions from one coordinate system to another.  Currently supports the conversion of a __customOffset__ coordinate system to __WGS84__.


Hello reposition!
-----------------

```javascript
const reposition = require('reposition');

const COORDINATE_SYSTEM = {
    type: "customOrigin",
    originOffset: [ -73.57123, 45.50883, 0 ],
    measurementUnits: [ 'ft', 'ft', 'ft' ]
};

let position = [ -2240.450648739, 4071.88290589, 32.8084 ];
let convertedPosition = reposition.toWGS84(position, COORDINATE_SYSTEM);

console.log(convertedPosition);
```

Which should yield `[ -73.58, 45.52, 10 ]`.


Coordinate Systems
------------------

### customOrigin

A __customOrigin__ coordinate system uses an origin _other than_ 0° longitude, 0° latitude and measurements in standard units of a given type in each axis.

    {
      originOffset: [ -73.57123, 45.50883, 50 ],
      measurementUnits: [ 'deg', 'deg', 'm' ],
      horizontalPlaneRotation: 0
    }

At present, the origin offset coordinate system is assumed to be WGS84.  In future, an additional property may be added to specify this coordinate system.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2025 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
