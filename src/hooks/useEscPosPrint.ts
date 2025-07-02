import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { CONSTANTS } from "../utils/constants"

export const useEscPosPrint = () => {
    async function handlePrint(data: any, isDuplicate = false) {
        try {
            let tot_amt = 0
            console.log('dataaaaaaaaaaaaaa', data)
            console.log("Called Printer...")

            let columnSingleRow = [32]
            let columnWidths = [12, 1, 19]

            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`SSVWS`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`${isDuplicate ? "DUPLICATE RECEIPT" : "RECEIPT"}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`${data[0]?.branch_name}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `${data[0]?.branch_name}\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`======================`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `======================\r\n`,
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['DATE', ":", `${new Date(data[0]?.tnx_date).toLocaleDateString("en-GB")}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['TIME', ":", `${data[0]?.upload_on}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['GROUP', ":", `${(data[0]?.group_name as string)?.slice(0, 10)}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['CODE', ":", `${data[0]?.group_code}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['MODE', ":", `${data[0]?.tr_mode == 'B' ? 'UPI' : 'CASH'}`],
                {},
            );

            if (data[0]?.tr_mode == 'B') {
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ['ID', ":", `${data[0]?.cheque_id?.slice(-6)}`],
                    {},
                );
                await BluetoothEscposPrinter.printText(
                    `**************X*************\r\n`,
                    { align: "center" },
                );
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ['MEMBER', ":", `AMOUNT`],
                    {},
                );
            }

            for (const item of data) {
                console.log("===========++++++++++++++++>>>>>>>>>>>", data)
                tot_amt += item.credit
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [`${item?.client_name?.slice(0, 10)}`, ":", `${+item?.credit}`],
                    {},
                );
            }

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['TOTAL', ":", `${tot_amt}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['OUTSTANDING', ":", `${data[0]?.outstanding}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['COLLECTOR', ":", `${data[0]?.collec_name}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['CODE', ":", `${data[0]?.collec_code}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `======================\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`======================`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['HELPLINE', ":", `${CONSTANTS.helplineNumeber}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `===========X==========\r\n\r\n\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`===========X==========`],
                {},
            );
            await BluetoothEscposPrinter.printText(
                `\r\n\r\n`,
                { align: "center" },
            )

            console.log("Called Printer...2")
            // setLoading(false)
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    return {
        handlePrint,
    }
}