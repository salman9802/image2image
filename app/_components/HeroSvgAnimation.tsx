export default function HeroSvgAnimation() {
  const inputPaths = [
    'M843.505 284.659L752.638 284.659C718.596 284.659 684.866 280.049 653.251 271.077L598.822 255.629L0.675021 1.00011',
    'M843.505 298.181L724.342 297.36C708.881 297.36 693.45 296.409 678.22 294.518L598.822 284.659C592.82 284.659 200.538 190.002 0.675028 164.892',
    'M843.505 311.703L701.108 310.061L598.822 305.136L0.675049 256.071',
    'M843.505 325.224L598.822 326.002L0.675049 321.858',
    'M843.505 338.746L701.108 340.388L598.822 345.442L0.675038 387.646',
    'M843.505 352.268L724.342 353.088C708.881 353.088 693.45 354.039 678.22 355.93L598.822 365.789L0.675067 478.825',
    'M843.505 365.789L752.638 365.789C718.596 365.789 684.866 370.399 653.251 379.372L598.822 394.82L0.675049 642.717',
  ];

  const outputPaths = [
    'M843.325 1.00011L245.178 255.629L190.749 271.077C159.134 280.049 125.404 284.659 91.362 284.659L0.495 284.659',
    'M843.325 164.892L245.178 284.659L165.78 294.518C150.55 296.409 135.119 297.36 119.658 297.36L0.495 298.181',
    'M843.325 256.071L245.178 305.136L142.892 310.061L0.495 311.703',
    'M843.325 321.858L245.178 326.002L0.495 325.224',
    'M843.325 387.646L245.178 345.442L142.892 340.388L0.495 338.746',
    'M843.325 478.825L245.178 365.789L165.78 355.93C150.55 354.039 135.119 353.088 119.658 353.088L0.495 352.268',
    'M843.325 642.717L245.178 394.82L190.749 379.372C159.134 370.399 125.404 365.789 91.362 365.789L0.495 365.789',
  ];

  return (
    <div className="relative isolate">
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="relative w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            //         width="800"
            //         height="600"
            //         viewBox="0 0 800 600"
            width="844"
            height="644"
            viewBox="0 0 844 644"
            fill="none"
            className="border border-red-500"
          >
            <g className="input-lines">
              {inputPaths.map((inputPath, i) => (
                <path
                  key={i}
                  d={inputPath}
                  stroke="black"
                />
              ))}
            </g>

            <g className="input-lines">
              {outputPaths.map((outputPath, i) => (
                <path
                  key={i}
                  d={outputPath}
                  stroke="black"
                />
              ))}
            </g>

            {/* Center image container */}
            <g transform="translate(422 322)">
              <rect
                x="-66"
                y="-66"
                width="132"
                height="132"
                rx="28"
                fill="var(--react-card-bg, #111827)"
                stroke="#61DAFB"
                strokeOpacity="0.6"
                strokeWidth="1.5"
              />

              {/* React logo */}
              <g transform="scale(1.25)" stroke="#61DAFB" strokeWidth="2.5">
                <ellipse rx="24" ry="9" />
                <ellipse rx="24" ry="9" transform="rotate(60)" />
                <ellipse rx="24" ry="9" transform="rotate(120)" />
                <circle r="3.5" fill="#61DAFB" stroke="none" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

