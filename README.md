
# Asinus

The application for making rational choice. 

Name "Asinus" is a reference to Latin "Asinus Buridani" - Buridan's ass.

## Requirements and installation

To run app from it's sources you need to install Electron - https://electronjs.org/docs/tutorial/installation

To run binary package you need to download it for your OS here - https://github.com/qiray/asinus/releases/tag/1.0.0

## Usage

This app can help you to use decision theory in some practical cases. 

If you want to make rational choice from multiple options you need some formalization.

First you should identify main criteria. For example the criteria of CPUs can be rating, performance, price etc. Then you should set weights for each criterion according to it's importance. For example for you performance is twice more important than rating and price. So you can set performance weight as 1 and rating with price as 0.5. One more remark - you should mark price as "Inverted" because bigger price is worse than the lower one when we make a purchase.

Second you should fill table with variants and their criteria values. And this is it. After calculating all weights and values you'll have a result table with normalized values and total column with sums of variants' values.

See in-app help and examples for more information.

## License
This application uses The 3-Clause BSD License. For more information see the LICENSE file.
