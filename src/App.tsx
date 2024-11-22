import { IPv4 } from "internet-address"
import { type Format as IPv4ToStringFormat, PartFormat as IPv4ToStringFormatFormat } from "internet-address/IPv4/toString"
import { createMemo, createSignal, Setter } from "solid-js"

const isPartsCount = (input: number): input is 1 | 2 | 3 | 4 => Number.isInteger(input) && input > 0 && input < 5

export default () => {
	const [ getIpInputValue, setIpInputValue ] = createSignal(``)
	const [ getFirstPartFormat, setFirstPartFormat ] = createSignal(IPv4ToStringFormatFormat.Decimal)
	const [ getSecondPartFormat, setSecondPartFormat ] = createSignal(IPv4ToStringFormatFormat.Decimal)
	const [ getThirdPartFormat, setThirdPartFormat ] = createSignal(IPv4ToStringFormatFormat.Decimal)
	const [ getFourthPartFormat, setFourthPartFormat ] = createSignal(IPv4ToStringFormatFormat.Decimal)
	const [ getParts, setParts ] = createSignal<1 | 2 | 3 | 4>(4)

	const getFormat = createMemo((): IPv4ToStringFormat => {
		const parts = getParts()

		if (parts == 1)
			return [ getFirstPartFormat() ]

		if (parts == 2)
			return [ getFirstPartFormat(), getSecondPartFormat() ]

		if (parts == 3)
			return [ getFirstPartFormat(), getSecondPartFormat(), getThirdPartFormat() ]

		return [ getFirstPartFormat(), getSecondPartFormat(), getThirdPartFormat(), getFourthPartFormat() ]
	})

	const getFormattedIp = createMemo(() => {
		const parsedIp = IPv4.parse(getIpInputValue())

		if (parsedIp)
			return IPv4.toString(parsedIp, getFormat())
	})

	const PartFormatSelect = (props: { setter: Setter<IPv4ToStringFormatFormat>, disabled?: boolean }) => {
		return <select
			disabled={props.disabled}
			onInput={({ currentTarget }) => handleInput(currentTarget)}
			ref={selectElement => handleInput(selectElement)}
		>
			<option value="decimal" selected>Decimal</option>
			<option value="octal">Octal</option>
		</select>

		function handleInput(inputElement: HTMLSelectElement) {
			if (inputElement.value == `decimal`)
				props.setter(IPv4ToStringFormatFormat.Decimal)

			if (inputElement.value == `octal`)
				props.setter(IPv4ToStringFormatFormat.Octal)
		}
	}
	
	return <>
		<table style={{ width: `fit-content` }}>
			<tbody>
				<tr>
					<th>Address:</th>

					<td>
						<input
							type="text"
							value="192.168.1"
							onInput={({ currentTarget }) => setIpInputValue(currentTarget.value)}
							ref={inputElement => setTimeout(() => setIpInputValue(inputElement.value))}
						/>
					</td>
				</tr>

				<tr>
					<th>Parts:</th>

					<td>
						<input
							type="number"
							value="4"
							min="1"
							max="4"
							onInput={({ currentTarget }) => handlePartsCountInput(currentTarget)}
							ref={inputElement => setTimeout(() => handlePartsCountInput(inputElement))}
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<PartFormatSelect setter={setFirstPartFormat}/>
		<PartFormatSelect setter={setSecondPartFormat} disabled={getParts() < 2}/>
		<PartFormatSelect setter={setThirdPartFormat} disabled={getParts() < 3}/>
		<PartFormatSelect setter={setFourthPartFormat} disabled={getParts() < 4}/>
		<p><b>Formatted:</b> {getFormattedIp()}</p>
		<p><a href="https://github.com/samualtnorman/ipv4-formatter" target="_blank" rel="noreferrer">View the source code.</a></p>
		<p>This is a demo that uses my <a href="https://www.npmjs.com/package/internet-address" target="_blank" rel="noreferrer"><code>internet-address</code> NPM package</a>.</p>
	</>

	function handlePartsCountInput(inputElement: HTMLInputElement) {
		const partsCount = Number(inputElement.value)

		if (isPartsCount(partsCount))
			setParts(partsCount)
	}
}

