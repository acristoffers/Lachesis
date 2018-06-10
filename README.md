# Lachesis

Lachesis is a frontend for [moirai](https://github.com/acristoffers/moirai). It
is developed as part of my scientific initiation project, named
_Plataformas de baixo custo para controle de processos_ (low-cost platform for
process control), developed at CEFET-MG (Brazil) under the supervision of Prof.
Dr. Valter Leite. The project was developed through a FAPEMIG scholarship.

This application allows you to configure the hardware, execute system response
tests and run controllers with an easy to use interface. The used input and
output signals, as well as variables, can be seen graphically, updating in real
time.

The controllers for this platform must be written in Python 3, using libraries
like NumPy and SciPy, if needed. Hardware interfacing, input/output management
and execution flow are controlled by the platform, taking the burden from you
and letting you focus on the design and test of your controllers/models.

It works only as a frontend, meaning that all data is stored and managed in/by
the _moirai_ server. The server is also responsible for executing the
controller. That means that you can install _moirai_ in a dedicated computer,
like a Raspberry Pi, and _Lachesis_ in another one, using _Lachesis_ like a
remote control for your control system. This allows various user to share plant
configuration.

## Instalation

Under [releases](https://github.com/acristoffers/Lachesis/releases), download
the latest version for your system. The Windows installer works with both 32 and
64 bits systems. The Linux version is an AppImage, which is
distribution-agnostic, just download and execute.

If you work with another system, like Linux ARM, BSD or Solaris, you can
checkout this repository and build the project yourself. It should run anywhere
electron and node runs. The best way to build this project is to install node
and yarn and execute `yarn dist` in the project root. This will install all
dependencies and build the project into desktop/dist.

## License

Copyright (c) 2016 Álan Crístoffer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
