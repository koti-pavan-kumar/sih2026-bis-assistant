"""
Generate realistic BIS-style sample PDFs for ManakMitra knowledge base.
These cover domains beyond the 3 original standards (IS 269, IS 1786, IS 456).
"""
import os
from pathlib import Path
from fpdf import FPDF


OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class BISDocument(FPDF):
    """Custom PDF class mimicking BIS document style."""

    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, f"Bureau of Indian Standards - {self.is_number}", align="C")
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def title_page(self, is_number, title, year, ics_code, subtitle="Specification"):
        self.add_page()
        self.ln(30)

        # BIS header
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, "Bureau of Indian Standards", align="C")
        self.ln(8)

        self.set_font("Helvetica", "", 11)
        self.cell(0, 7, "Manak Bhawan, 9, Bahadur Shah Zafar Marg", align="C")
        self.ln(5)
        self.cell(0, 7, "New Delhi - 110002", align="C")
        self.ln(15)

        # IS Number
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(0, 0, 128)
        self.cell(0, 12, is_number, align="C")
        self.ln(10)

        # Year
        self.set_font("Helvetica", "", 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, str(year), align="C")
        self.ln(15)

        # Title
        self.set_font("Helvetica", "B", 16)
        self.multi_cell(0, 10, title.upper(), align="C")
        self.ln(5)

        self.set_font("Helvetica", "B", 13)
        self.cell(0, 8, subtitle.upper(), align="C")
        self.ln(15)

        # ICS
        self.set_font("Helvetica", "", 10)
        self.cell(0, 6, f"ICS {ics_code}", align="C")
        self.ln(5)
        self.cell(0, 6, f" BIS {year}", align="C")
        self.ln(10)

        # Keywords
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, "Indian Standard", align="C")

    def section_heading(self, number, title):
        self.ln(5)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 0, 100)
        self.cell(0, 8, f"{number}  {title}")
        self.ln(8)
        self.set_text_color(0, 0, 0)

    def sub_heading(self, number, title):
        self.ln(3)
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 7, f"{number}  {title}")
        self.ln(7)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.multi_cell(0, 5, text)
        self.ln(3)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        x = self.get_x()
        self.cell(8, 5, "-")
        self.multi_cell(0, 5, text)
        self.ln(1)

    def table(self, headers, rows, col_widths=None):
        if col_widths is None:
            w = (self.w - 20) / len(headers)
            col_widths = [w] * len(headers)

        # Header
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(220, 220, 240)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True, align="C")
        self.ln()

        # Rows
        self.set_font("Helvetica", "", 9)
        for row in rows:
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6, str(cell), border=1, align="C")
            self.ln()
        self.ln(3)


def create_is_1489():
    """IS 1489:1991 - Portland Pozzolana Cement."""
    pdf = BISDocument()
    pdf.is_number = "IS 1489:1991"
    pdf.alias_nb_pages()
    pdf.title_page("IS 1489:1991", "Portland Pozzolana Cement", 1991, "91.100.10")

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard lays down the requirements for Portland Pozzolana Cement (PPC). "
        "Portland Pozzolana Cement is manufactured by inter-grinding Portland cement clinker "
        "with pozzolanic materials such as fly ash, calcined clay, or volcanic ash, together "
        "with gypsum. This standard covers three grades: 33, 43, and 53."
    )

    pdf.section_heading("2", "REFERENCES")
    pdf.bullet("IS 269:2015 - Ordinary Portland Cement, 33 Grade - Specification")
    pdf.bullet("IS 383:2016 - Coarse and Fine Aggregates for Concrete")
    pdf.bullet("IS 4031 (Part 1 to 15) - Methods of Physical and Chemical Tests for Cement")
    pdf.bullet("IS 1489 (Part 1):1991 - Portland Pozzolana Cement, Part 1: Fly Ash Based")
    pdf.bullet("IS 1489 (Part 2):1991 - Portland Pozzolana Cement, Part 2: Calcined Clay Based")

    pdf.section_heading("3", "DEFINITIONS")
    pdf.sub_heading("3.1", "Portland Pozzolana Cement")
    pdf.body_text(
        "Portland Pozzolana Cement is a hydraulic cement produced by inter-grinding "
        "Portland cement clinker with pozzolanic materials and gypsum. The pozzolanic "
        "material reacts with calcium hydroxide liberated during cement hydration to "
        "form additional calcium silicate hydrate, improving long-term strength and "
        "durability."
    )

    pdf.section_heading("4", "REQUIREMENTS")
    pdf.body_text("The cement shall conform to the requirements given in Table 1.")
    pdf.ln(3)

    pdf.table(
        ["S.No.", "Characteristic", "33 Grade", "43 Grade", "53 Grade"],
        [
            ["1", "Fineness (Blaine), m/kg, min.", "300", "300", "300"],
            ["2", "Soundness (Le Chatelier), mm, max.", "10", "10", "10"],
            ["3", "Setting Time (Vicat), min.", "", "", ""],
            ["", "  Initial, min.", "30", "30", "30"],
            ["", "  Final, max., min.", "600", "600", "600"],
            ["4", "Compressive Strength, MPa", "", "", ""],
            ["", "  3 days, min.", "10", "23", "27"],
            ["", "  7 days, min.", "16", "33", "37"],
            ["", "  28 days, min.", "33", "43", "53"],
            ["5", "Autoclave expansion, %, max.", "0.8", "0.8", "0.8"],
        ],
        [10, 60, 30, 30, 30],
    )

    pdf.section_heading("5", "COMPOSITION")
    pdf.sub_heading("5.1", "Pozzolana Content")
    pdf.body_text(
        "The percentage of pozzolana (fly ash or calcined clay) shall be between "
        "15% and 35% by mass of Portland Pozzolana Cement. For fly ash based PPC, "
        "the fly ash shall conform to IS 3812 (Part 1)."
    )

    pdf.sub_heading("5.2", "Gypsum")
    pdf.body_text(
        "The amount of gypsum added during grinding shall not exceed 5% by mass "
        "of the cement, calculated as calcium sulphate dihydrate (CaSO4.2H2O)."
    )

    pdf.section_heading("6", "TEST METHODS")
    pdf.body_text(
        "The methods of test for determining the various characteristics of cement "
        "shall be in accordance with IS 4031 (Part 1 to 15)."
    )
    pdf.bullet("Fineness: IS 4031 (Part 1) - Dry Sieve Method or Blaine Air Permeability")
    pdf.bullet("Soundness: IS 4031 (Part 3) - Le Chatelier Method")
    pdf.bullet("Setting Time: IS 4031 (Part 5) - Vicat Apparatus")
    pdf.bullet("Compressive Strength: IS 4031 (Part 6) - Cube Moulds (70.6 mm)")
    pdf.bullet("Autoclave Expansion: IS 4031 (Part 9)")

    pdf.section_heading("7", "MARKING")
    pdf.body_text(
        "Each bag or container of cement shall be clearly marked with the following "
        "information: (a) Name and trade mark of the manufacturer, (b) Name of the "
        "standard: IS 1489, (c) Grade of cement, (d) Net weight of cement, "
        "(e) Batch number, (f) Month and year of manufacture."
    )

    pdf.section_heading("8", "PACKING AND STORAGE")
    pdf.body_text(
        "Cement shall be packed in bags of 50 kg nominal mass. The cement shall be "
        "stored in dry conditions, protected from moisture. Storage silos or bins "
        "shall have proper ventilation to prevent caking."
    )

    filename = OUTPUT_DIR / "IS_1489_Portland_Pozzolana_Cement.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_2062():
    """IS 2062:2011 - Steel for General Structural Purposes."""
    pdf = BISDocument()
    pdf.is_number = "IS 2062:2011"
    pdf.alias_nb_pages()
    pdf.title_page("IS 2062:2011", "Steel for General Structural Purposes", 2011, "77.140.01")

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers the requirements for structural steel for general structural "
        "and engineering purposes in the form of plates, sections (including hollow sections), "
        "bars, and wire rods. The standard specifies chemical composition and mechanical "
        "properties for various grades."
    )

    pdf.section_heading("2", "GRADE DESIGNATION")
    pdf.body_text(
        "Structural steel shall be designated by the minimum yield stress in MPa. "
        "The following grades are covered: E165 (Fe 410 W A), E235 (Fe 410 W B), "
        "E250 (Fe 410 W C), E275 (Fe 410 W D), E300, E350, E410, E450."
    )

    pdf.section_heading("3", "CHEMICAL COMPOSITION")
    pdf.body_text("The steel shall conform to the chemical composition given in Table 1.")
    pdf.table(
        ["Grade", "C %, max", "Mn %", "S %, max", "P %, max", "Si %"],
        [
            ["E250 (Fe 410 W C)", "0.22", "1.50 max", "0.045", "0.045", "0.40 max"],
            ["E300", "0.22", "1.50 max", "0.045", "0.045", "0.40 max"],
            ["E350", "0.20", "1.60 max", "0.040", "0.040", "0.40 max"],
            ["E410", "0.20", "1.60 max", "0.040", "0.040", "0.40 max"],
        ],
        [35, 22, 22, 22, 22, 22],
    )

    pdf.section_heading("4", "MECHANICAL PROPERTIES")
    pdf.table(
        ["Grade", "Yield Stress\nMPa, min", "Tensile Strength\nMPa", "Elongation\n%, min"],
        [
            ["E250 (Fe 410 W C)", "250", "410-540", "23"],
            ["E300", "300", "440-570", "22"],
            ["E350", "350", "490-610", "20"],
            ["E410", "410", "540-660", "18"],
        ],
        [40, 35, 35, 30],
    )

    pdf.section_heading("5", "DIMENSIONAL TOLERANCES")
    pdf.sub_heading("5.1", "Plate Thickness")
    pdf.body_text(
        "For plates of thickness up to 20 mm, the tolerance shall be 0.5 mm. "
        "For plates of thickness above 20 mm up to 40 mm, the tolerance shall be "
        "0.75 mm."
    )

    pdf.section_heading("6", "TEST METHODS")
    pdf.bullet("Tensile Test: IS 1608 (Part 1) - Room Temperature Test")
    pdf.bullet("Chemical Analysis: IS 228 (Part 1 to 12)")
    pdf.bullet("Bend Test: IS 1599")
    pdf.bullet("Dimensional Check: IS 1852")

    pdf.section_heading("7", "MARKING")
    pdf.body_text(
        "Each plate, section, or bar shall be legibly marked with: (a) Manufacturer's "
        "name or trademark, (b) Standard designation IS 2062, (c) Grade of steel, "
        "(d) Heat number, (e) Size dimensions."
    )

    filename = OUTPUT_DIR / "IS_2062_Structural_Steel.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_13252():
    """IS 13252:2010 - IT Equipment Safety."""
    pdf = BISDocument()
    pdf.is_number = "IS 13252:2010"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 13252:2010",
        "Information Technology Equipment - Safety",
        2010,
        "35.200",
        "Specification",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard specifies safety requirements for information technology (IT) "
        "equipment including computers, printers, monitors, servers, and networking "
        "equipment. It covers protection against electric shock, energy-related hazards, "
        "fire, heat, mechanical, and radiation hazards."
    )

    pdf.section_heading("2", "REFERENCES")
    pdf.bullet("IEC 60950-1 - IT Equipment Safety, Part 1: General Requirements")
    pdf.bullet("IS 14711 (Part 1) - Electromagnetic Compatibility")
    pdf.bullet("ISO/IEC 24700 - Energy Efficiency of IT Equipment")

    pdf.section_heading("3", "DEFINITIONS")
    pdf.sub_heading("3.1", "Accessible Part")
    pdf.body_text(
        "A part that can be touched by a test finger as specified in this standard. "
        "An accessible part is one that is within reach of a person during normal use."
    )

    pdf.section_heading("4", "PROTECTION AGAINST ELECTRIC SHOCK")
    pdf.sub_heading("4.1", "Basic Insulation")
    pdf.body_text(
        "Equipment shall be constructed so that accessible parts are not live in "
        "normal use. Where basic insulation is used, the equipment shall be Class I "
        "or Class II construction."
    )

    pdf.sub_heading("4.2", "Leakage Current Limits")
    pdf.table(
        ["Equipment Type", "Earth Leakage\nmA, max", "Touch Current\nmA, max"],
        [
            ["Portable IT equipment", "0.25", "0.25"],
            ["Stationary IT equipment", "0.75", "0.50"],
            ["Server racks", "3.50", "1.00"],
        ],
        [50, 40, 40],
    )

    pdf.section_heading("5", "ENERGY-RELATED HAZARDS")
    pdf.sub_heading("5.1", "Power Supply")
    pdf.body_text(
        "The equipment shall be designed for the rated voltage of 240V, 50 Hz AC "
        "supply as per IS 1293. The equipment shall tolerate voltage fluctuations "
        "of 10% of the rated voltage."
    )

    pdf.section_heading("6", "FIRE HAZARDS")
    pdf.sub_heading("6.1", "Material Requirements")
    pdf.body_text(
        "Enclosure materials shall have a minimum flammability rating of V-1 "
        "as per UL 94. Printed circuit boards shall have a minimum rating of V-0. "
        "Materials in the path of potential ignition sources shall be non-combustible."
    )

    pdf.section_heading("7", "MECHANICAL HAZARDS")
    pdf.body_text(
        "Moving parts such as fans, disk drives, and paper feed mechanisms shall "
        "be enclosed or guarded to prevent injury during normal operation. Sharp "
        "edges on enclosures shall be rounded to a minimum radius of 0.5 mm."
    )

    pdf.section_heading("8", "TEST METHODS")
    pdf.bullet("Dielectric Strength Test: Apply 1500V AC for 1 minute")
    pdf.bullet("Earth Continuity Test: 25A for 5 seconds, voltage drop 2.5V")
    pdf.bullet("Leakage Current Test: As per IEC 60950-1, Clause 5.1")
    pdf.bullet("Temperature Rise: Surface temperature shall not exceed 70C")
    pdf.bullet("Burn Test: Enclosure material V-1 rating per UL 94")

    filename = OUTPUT_DIR / "IS_13252_IT_Equipment_Safety.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_14543():
    """IS 14543:2018 - Milk and Milk Products Safety."""
    pdf = BISDocument()
    pdf.is_number = "IS 14543:2018"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 14543:2018",
        "Milk and Milk Products - Safety Requirements",
        2018,
        "67.100.01",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard specifies safety and quality requirements for milk and milk "
        "products intended for human consumption. It covers requirements for "
        "composition, hygiene, contaminants, and labeling."
    )

    pdf.section_heading("2", "DEFINITIONS")
    pdf.sub_heading("2.1", "Milk")
    pdf.body_text(
        "The normal mammary secretion obtained from one or more milch animals by "
        "complete milking, without either addition thereto or extraction therefrom."
    )

    pdf.sub_heading("2.2", "Toned Milk")
    pdf.body_text(
        "Milk which has been standardized to contain not less than 3.0% fat and "
        "not less than 8.5% solids not fat (SNF)."
    )

    pdf.section_heading("3", "COMPOSITION REQUIREMENTS")
    pdf.table(
        ["Product", "Fat %, min", "SNF %, min", "Moisture %, max"],
        [
            ["Whole Milk (Cow)", "3.5", "8.5", "87.5"],
            ["Whole Milk (Buffalo)", "6.0", "9.0", "85.0"],
            ["Toned Milk", "3.0", "8.5", "88.5"],
            ["Double Toned Milk", "1.5", "9.0", "89.5"],
            ["Skimmed Milk", "0.5", "9.0", "90.5"],
            ["Cream", "25.0", "5.0", "-"],
            ["Ghee (Butter Oil)", "99.5", "-", "0.5"],
            ["Milk Powder (Whole)", "26.0", "36.0", "4.0"],
            ["Condensed Milk", "8.0", "26.0", "27.0"],
        ],
        [40, 28, 28, 28],
    )

    pdf.section_heading("4", "CONTAMINANTS AND RESIDUES")
    pdf.sub_heading("4.1", "Heavy Metals")
    pdf.table(
        ["Contaminant", "Limit", "Test Method"],
        [
            ["Lead (Pb)", "0.02 mg/kg", "IS 14543 Annex A"],
            ["Arsenic (As)", "0.01 mg/kg", "IS 14543 Annex B"],
            ["Cadmium (Cd)", "0.005 mg/kg", "IS 14543 Annex C"],
            ["Mercury (Hg)", "0.001 mg/kg", "IS 14543 Annex D"],
        ],
        [40, 40, 50],
    )

    pdf.sub_heading("4.2", "Pesticide Residues")
    pdf.body_text(
        "Milk shall not contain pesticide residues above the Maximum Residue Limits "
        "(MRL) specified in the Food Safety and Standards (Contaminants, Toxins and "
        "Residues) Regulations, 2011."
    )

    pdf.section_heading("5", "MICROBIOLOGICAL REQUIREMENTS")
    pdf.table(
        ["Parameter", "Unit", "Limit"],
        [
            ["Total Plate Count", "CFU/g or mL", "50,000"],
            ["Coliform Count", "MPN/g or mL", "<1"],
            ["E. coli", "MPN/g or mL", "Absent"],
            ["Salmonella", "/25g", "Absent"],
            ["Staphylococcus aureus", "CFU/g or mL", "100"],
        ],
        [50, 40, 40],
    )

    pdf.section_heading("6", "HYGIENE REQUIREMENTS")
    pdf.body_text(
        "All operations from collection to packaging shall be carried out under "
        "hygienic conditions as specified in IS 15742 (Code of Hygienic Practice "
        "for Milk and Milk Products). The processing plant shall maintain cold "
        "chain at 42C throughout."
    )

    pdf.section_heading("7", "TEST METHODS")
    pdf.bullet("Fat Content: IS 12249 - Gerber Method")
    pdf.bullet("SNF Content: IS 12249 - Calculation from density and fat")
    pdf.bullet("Total Plate Count: IS 5402 - Pour Plate Method")
    pdf.bullet("Coliform Count: IS 16666 - MPN Method")

    filename = OUTPUT_DIR / "IS_14543_Milk_Safety.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_1758():
    """IS 1758:2016 - Textile Fabrics."""
    pdf = BISDocument()
    pdf.is_number = "IS 1758:2016"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 1758:2016",
        "Textile Fabrics - Determination of Dimensional Changes",
        2016,
        "59.080.30",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard specifies the method for determination of dimensional changes "
        "(shrinkage or extension) of woven and knitted textile fabrics when subjected "
        "to washing, drying, or ironing under specified conditions."
    )

    pdf.section_heading("2", "REFERENCES")
    pdf.bullet("IS 1758 (Part 2) - Dimensional Changes after Home Laundering")
    pdf.bullet("IS 2454 - Sampling Procedures for Textile Fabrics")
    pdf.bullet("IS 3820 - Textiles: Standard Atmosphere for Conditioning")

    pdf.section_heading("3", "PRINCIPLE")
    pdf.body_text(
        "Specimens of known dimensions are marked, subjected to the specified treatment "
        "(washing, drying, or ironing), and the change in dimensions is measured and "
        "expressed as a percentage of the original dimension."
    )

    pdf.section_heading("4", "REQUIREMENTS")
    pdf.sub_heading("4.1", "Dimensional Tolerance")
    pdf.table(
        ["Fabric Type", "Wash Shrinkage\n%, max", "Dry Shrinkage\n%, max", "Iron Shrinkage\n%, max"],
        [
            ["Cotton Woven", "5.0", "3.0", "2.0"],
            ["Polyester Woven", "2.0", "1.5", "1.0"],
            ["Cotton Knitted", "7.0", "4.0", "2.5"],
            ["Polyester Knitted", "3.0", "2.0", "1.0"],
            ["Blended Woven", "4.0", "2.5", "1.5"],
            ["Denim", "6.0", "3.5", "2.0"],
        ],
        [40, 30, 30, 30],
    )

    pdf.section_heading("5", "FASTNESS REQUIREMENTS")
    pdf.sub_heading("5.1", "Color Fastness to Washing")
    pdf.table(
        ["Grade", "Change in Color", "Staining"],
        [
            ["5 (Excellent)", "No change", "No staining"],
            ["4 (Good)", "Slight change", "Slight staining"],
            ["3 (Moderate)", "Moderate change", "Moderate staining"],
            ["2 (Fair)", "Considerable change", "Considerable staining"],
        ],
        [35, 45, 45],
    )

    pdf.section_heading("6", "TEST METHODS")
    pdf.bullet("Dimensional Change: IS 1758 - After 5 wash cycles at 40C")
    pdf.bullet("Color Fastness to Washing: IS 11623 - Multiple Leg Method")
    pdf.bullet("Color Fastness to Light: IS 106 Part 2 - Xenon Arc Lamp")
    pdf.bullet("Pilling Resistance: IS 12947 - Martindale Method")
    pdf.bullet("Tensile Strength: IS 1969 - Strip Method")

    filename = OUTPUT_DIR / "IS_1758_Textile_Fabrics.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_383():
    """IS 383:2016 - Coarse and Fine Aggregates for Concrete."""
    pdf = BISDocument()
    pdf.is_number = "IS 383:2016"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 383:2016",
        "Coarse and Fine Aggregates for Concrete",
        2016,
        "91.100.15",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers the requirements for aggregates obtained from natural "
        "sources for use in concrete. It specifies grading requirements, physical "
        "properties, and chemical limits for both coarse and fine aggregates."
    )

    pdf.section_heading("2", "CLASSIFICATION")
    pdf.sub_heading("2.1", "Fine Aggregate (Sand)")
    pdf.body_text(
        "Fine aggregate is material passing through 4.75 mm IS sieve and retained "
        "on 150 micron IS sieve. It is classified as Zone I, Zone II, Zone III, "
        "or Zone IV based on particle size distribution."
    )

    pdf.sub_heading("2.2", "Coarse Aggregate")
    pdf.body_text(
        "Coarse aggregate is material retained on 4.75 mm IS sieve. It is classified "
        "as single sized or graded aggregate with nominal sizes of 10mm, 12.5mm, "
        "16mm, 20mm, 25mm, 31.5mm, and 40mm."
    )

    pdf.section_heading("3", "GRADING REQUIREMENTS - FINE AGGREGATE")
    pdf.table(
        ["IS Sieve Size", "Zone I", "Zone II", "Zone III", "Zone IV"],
        [
            ["4.75 mm", "100", "100", "100", "100"],
            ["2.36 mm", "90-100", "90-100", "90-100", "90-100"],
            ["1.18 mm", "60-95", "75-100", "85-100", "95-100"],
            ["600 m", "35-59", "60-84", "75-100", "90-100"],
            ["300 m", "8-30", "15-44", "25-59", "40-79"],
            ["150 m", "0-10", "0-16", "2-25", "10-35"],
        ],
        [35, 25, 25, 25, 25],
    )

    pdf.section_heading("4", "PHYSICAL PROPERTIES")
    pdf.table(
        ["Property", "Fine Aggregate", "Coarse Aggregate"],
        [
            ["Specific Gravity", "2.5 - 3.0", "2.5 - 3.0"],
            ["Water Absorption, %", "2.0 max", "2.0 max"],
            ["Aggregate Impact Value, %", "-", "30 max (for non-wearing)"],
            ["Aggregate Crushing Value, %", "-", "30 max"],
            ["Abrasion Value, %", "-", "30 max (Los Angeles)"],
            ["Fineness Modulus", "2.0-3.5", "-"],
        ],
        [50, 45, 45],
    )

    pdf.section_heading("5", "CHEMICAL LIMITS")
    pdf.bullet("Chloride Content: 0.05% by mass of aggregate (for prestressed concrete)")
    pdf.bullet("Sulphate (as SO3): 0.5% by mass of aggregate")
    pdf.bullet("Alkali Reactivity: Mortar bar expansion 0.05% at 12 months")
    pdf.bullet("Organic Impurities: Color of solution shall not be darker than reference")

    filename = OUTPUT_DIR / "IS_383_Aggregates_Concrete.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_2185():
    """IS 2185:2005 - Concrete Masonry Units."""
    pdf = BISDocument()
    pdf.is_number = "IS 2185:2005"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 2185:2005",
        "Concrete Masonry Units - Specification",
        2005,
        "91.100.30",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers the requirements for concrete masonry units (blocks) "
        "made from Portland cement, water, and aggregates with or without additions. "
        "It specifies requirements for solid blocks, hollow blocks, and light-weight blocks."
    )

    pdf.section_heading("2", "CLASSIFICATION")
    pdf.body_text("Concrete blocks are classified as follows:")
    pdf.bullet("Type A: Load-bearing blocks (for structural walls)")
    pdf.bullet("Type B: Non-load-bearing blocks (for partition walls)")
    pdf.bullet("Type C: Insulating blocks (thermal insulation)")

    pdf.section_heading("3", "DIMENSIONS AND TOLERANCES")
    pdf.table(
        ["Nominal Size (LWH)", "Tolerance (L)", "Tolerance (W)", "Tolerance (H)"],
        [
            ["390190190 mm", "3 mm", "3 mm", "3 mm"],
            ["39019090 mm", "3 mm", "3 mm", "3 mm"],
            ["390290190 mm", "3 mm", "3 mm", "3 mm"],
        ],
        [45, 35, 35, 35],
    )

    pdf.section_heading("4", "COMPRESSIVE STRENGTH")
    pdf.table(
        ["Block Type", "Average Strength\nMPa, min", "Individual Strength\nMPa, min"],
        [
            ["Type A (Load-bearing)", "3.5", "2.8"],
            ["Type B (Non-load-bearing)", "2.5", "2.0"],
            ["Type C (Insulating)", "1.5", "1.2"],
        ],
        [45, 40, 40],
    )

    pdf.section_heading("5", "WATER ABSORPTION")
    pdf.body_text(
        "The water absorption shall not exceed 15% by mass for normal-weight blocks "
        "and 20% by mass for light-weight blocks, when tested as per IS 2185."
    )

    pdf.section_heading("6", "TEST METHODS")
    pdf.bullet("Compressive Strength: IS 2185 Part 1 - Cube Test (150mm)")
    pdf.bullet("Water Absorption: IS 2185 Part 1 - Soaking Method")
    pdf.bullet("Dimensional Tolerance: IS 2185 Part 1 - Measurement")
    pdf.bullet("Drying Shrinkage: IS 2185 Part 1 - 28-day drying test")

    filename = OUTPUT_DIR / "IS_2185_Concrete_Masonry_Units.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_12040():
    """IS 12040:1997 - Ready Mixed Concrete."""
    pdf = BISDocument()
    pdf.is_number = "IS 12040:1997"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 12040:1997",
        "Ready Mixed Concrete",
        1997,
        "91.100.30",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers ready mixed concrete (RMC) produced in a central batching "
        " plant and delivered to the site in a truck mixer. It specifies requirements "
        "for production, delivery, and quality control of RMC."
    )

    pdf.section_heading("2", "DEFINITIONS")
    pdf.sub_heading("2.1", "Ready Mixed Concrete")
    pdf.body_text(
        "Concrete manufactured in a batching plant and delivered to the construction "
        "site in a truck mixer in a plastic (unhardened) condition."
    )

    pdf.section_heading("3", "GRADE DESIGNATION")
    pdf.body_text(
        "RMC is designated by its characteristic compressive strength at 28 days in MPa. "
        "Common grades: M10, M15, M20, M25, M30, M35, M40, M45, M50."
    )

    pdf.section_heading("4", "MIX PROPORTIONS")
    pdf.table(
        ["Grade", "Cement\nkg/m", "Water\nL/m", "Sand\nkg/m", "Aggregate\nkg/m"],
        [
            ["M15", "220", "185", "750", "1100"],
            ["M20", "280", "185", "700", "1080"],
            ["M25", "320", "185",  "670", "1060"],
            ["M30", "360", "185", "640", "1040"],
            ["M35", "400", "185", "600", "1020"],
            ["M40", "440", "185", "560", "1000"],
        ],
        [25, 25, 25, 30, 30],
    )

    pdf.section_heading("5", "QUALITY CONTROL")
    pdf.sub_heading("5.1", "Slump Test")
    pdf.table(
        ["Concrete Class", "Slump mm"],
        [
            ["Very Low (VL)", "0-25"],
            ["Low (L)", "25-50"],
            ["Medium (M)", "50-100"],
            ["High (H)", "100-150"],
            ["Very High (VH)", "150-200"],
        ],
        [50, 50],
    )

    pdf.section_heading("6", "DELIVERY REQUIREMENTS")
    pdf.body_text(
        "RMC shall be delivered to the site within 90 minutes of batching for normal "
        "conditions and within 60 minutes for hot weather conditions (ambient temperature "
        ">30C). The truck mixer shall maintain a speed of 2-6 rpm during transport."
    )

    filename = OUTPUT_DIR / "IS_12040_Ready_Mixed_Concrete.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_16001():
    """IS 16001:2012 - Fly Ash for Cement Manufacture."""
    pdf = BISDocument()
    pdf.is_number = "IS 16001:2012"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 16001:2012",
        "Fly Ash for Cement Manufacture",
        2012,
        "91.100.10",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard specifies the requirements for fly ash generated from burning "
        "bituminous or sub-bituminous coal in thermal power plants, for use as a "
        "raw material in the manufacture of Portland cement."
    )

    pdf.section_heading("2", "DEFINITIONS")
    pdf.sub_heading("2.1", "Fly Ash")
    pdf.body_text(
        "The finely divided residue resulting from the combustion of pulverized coal "
        "in thermal power plants, collected by means of electrostatic precipitators "
        "or mechanical devices."
    )

    pdf.section_heading("3", "CHEMICAL COMPOSITION")
    pdf.table(
        ["Oxide", "Class F (Bituminous)", "Class C (Sub-bituminous)"],
        [
            ["SiO2 + Al2O3 + Fe2O3, %, min", "70.0", "50.0"],
            ["SO3, %, max", "3.0", "5.0"],
            ["CaO, %, max", "10.0", "25.0"],
            ["MgO, %, max", "5.0", "5.0"],
            ["Loss on Ignition, %, max", "5.0", "5.0"],
            ["Moisture Content, %, max", "1.0", "1.0"],
        ],
        [50, 40, 40],
    )

    pdf.section_heading("4", "PHYSICAL PROPERTIES")
    pdf.table(
        ["Property", "Requirement"],
        [
            ["Fineness (45 m sieve), % retained, max", "35"],
            ["Soundness (Le Chatelier), mm, max", "5"],
            ["Compressive Strength Ratio (28 day), min", "0.80"],
            ["Activity Index (7 day), min", "65% of control"],
        ],
        [65, 45],
    )

    pdf.section_heading("5", "TEST METHODS")
    pdf.bullet("Fineness: IS 4031 (Part 1) - Wet Sieve Method")
    pdf.bullet("Chemical Analysis: IS 13821 - X-ray Fluorescence")
    pdf.bullet("Compressive Strength: IS 4031 (Part 6) - Mortar Cubes")
    pdf.bullet("Loss on Ignition: IS 13821 - Furnace at 950C")

    filename = OUTPUT_DIR / "IS_16001_Fly_Ash_Cement.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_455():
    """IS 455:1989 - Portland Slag Cement."""
    pdf = BISDocument()
    pdf.is_number = "IS 455:1989"
    pdf.alias_nb_pages()
    pdf.title_page(
        "IS 455:1989",
        "Portland Slag Cement - Specification",
        1989,
        "91.100.10",
    )

    pdf.add_page()
    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers the requirements for Portland Slag Cement (PSC) "
        "manufactured by inter-grinding Portland cement clinker with granulated "
        "slag and gypsum. PSC is particularly suitable for marine and mass "
        "concrete construction due to its low heat of hydration and sulfate "
        "resistance."
    )

    pdf.section_heading("2", "COMPOSITION")
    pdf.body_text(
        "Portland Slag Cement shall contain: (a) Clinker: 25-50% by mass, "
        "(b) Granulated Slag: 40-70% by mass, (c) Gypsum: 3-5% by mass. "
        "The granulated slag shall conform to IS 455 Annex A."
    )

    pdf.section_heading("3", "REQUIREMENTS")
    pdf.table(
        ["Characteristic", "33 Grade", "43 Grade", "53 Grade"],
        [
            ["Fineness (Blaine), m/kg, min.", "300", "300", "300"],
            ["Soundness (Le Chatelier), mm, max.", "10", "10", "10"],
            ["Initial Setting Time, min, min.", "30", "30", "30"],
            ["Final Setting Time, min, max.", "600", "600", "600"],
            ["Compressive Strength 3d, MPa, min.", "8", "18", "23"],
            ["Compressive Strength 7d, MPa, min.", "14", "28", "33"],
            ["Compressive Strength 28d, MPa, min.", "33", "43", "53"],
        ],
        [45, 30, 30, 30],
    )

    pdf.section_heading("4", "SULFATE RESISTANCE")
    pdf.body_text(
        "Portland Slag Cement exhibits excellent sulfate resistance due to the "
        "presence of slag. When tested as per IS 4031 (Part 12), the expansion "
        "at 6 months shall not exceed 0.05% in 5% sodium sulfate solution."
    )

    pdf.section_heading("5", "TEST METHODS")
    pdf.bullet("Fineness: IS 4031 (Part 1) - Blaine Air Permeability")
    pdf.bullet("Soundness: IS 4031 (Part 3) - Le Chatelier")
    pdf.bullet("Setting Time: IS 4031 (Part 5) - Vicat Apparatus")
    pdf.bullet("Compressive Strength: IS 4031 (Part 6) - 50mm Cubes")
    pdf.bullet("Sulfate Resistance: IS 4031 (Part 12)")

    filename = OUTPUT_DIR / "IS_455_Portland_Slag_Cement.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_269():
    """IS 269:2015 - Ordinary Portland Cement, 33 Grade."""
    pdf = BISDocument()
    pdf.is_number = "IS 269:2015"
    pdf.title_page("IS 269:2015", "Ordinary Portland Cement, 33 Grade", 2015, "91.100.10")

    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers the manufacture and properties of ordinary "
        "portland cement of 33 grade, used for general construction purposes "
        "including plain and reinforced concrete, masonry mortar, and plastering."
    )

    pdf.section_heading("2", "COMPOSITION")
    pdf.body_text(
        "The cement shall be produced by intimately mixing together calcareous "
        "and argillaceous and/or other silica, alumina or iron oxide-bearing "
        "materials, burning them at a clinkering temperature, and grinding "
        "the resultant clinker with a small quantity of gypsum."
    )
    pdf.bullet("Tricalcium Silicate (C3S): 45-65%")
    pdf.bullet("Dicalcium Silicate (C2S): 10-30%")
    pdf.bullet("Tricalcium Aluminate (C3A): 0-8%")
    pdf.bullet("Tetracalcium Aluminoferrite (C4AF): 6-20%")

    pdf.section_heading("3", "PHYSICAL REQUIREMENTS")
    table_data = [
        ["Property", "Requirement", "Test Method"],
        ["Fineness (Blaine)", "Min 225 m2/kg", "IS 4031 (Part 2)"],
        ["Soundness (Le Chatelier)", "Max 10 mm", "IS 4031 (Part 3)"],
        ["Setting Time - Initial", "Min 30 minutes", "IS 4031 (Part 5)"],
        ["Setting Time - Final", "Max 600 minutes", "IS 4031 (Part 5)"],
        ["Compressive Strength - 3 days", "Min 10 MPa", "IS 4031 (Part 6)"],
        ["Compressive Strength - 7 days", "Min 16 MPa", "IS 4031 (Part 6)"],
        ["Compressive Strength - 28 days", "Min 33 MPa", "IS 4031 (Part 6)"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("4", "CHEMICAL REQUIREMENTS")
    table_data = [
        ["Oxide", "Percentage by Mass"],
        ["Magnesia (MgO)", "Max 6.0%"],
        ["Sulfur Trioxide (SO3)", "Max 3.5%"],
        ["Chloride (as Cl-)", "Max 0.10%"],
        ["Loss on Ignition", "Max 5.0%"],
        ["Insoluble Residue", "Max 4.0%"],
        ["Lime Saturation Factor", "0.66-1.02"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("5", "MARKING")
    pdf.body_text(
        "Each bag or container shall be distinctly marked with the following: "
        "(a) Name and trade mark, (b) IS 269:2015, (c) Net quantity, "
        "(d) Date and time of packing, (e) Lot number, "
        "(f) Grade designation: 33."
    )

    filename = OUTPUT_DIR / "IS_269_Ordinary_Portland_Cement_33.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_1786():
    """IS 1786:2008 - High Strength Deformed Steel Bars."""
    pdf = BISDocument()
    pdf.is_number = "IS 1786:2008"
    pdf.title_page("IS 1786:2008", "High Strength Deformed Steel Bars", 2008, "77.140.15")

    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard covers hot rolled high strength deformed steel bars "
        "and wires for concrete reinforcement. These bars have deformations "
        "on the surface for better bonding with concrete."
    )

    pdf.section_heading("1", "GRADE DESIGNATIONS")
    table_data = [
        ["Grade", "YS (Min)", "UTS (Min)", "Elongation (Min)"],
        ["Fe 415", "415 MPa", "485 MPa", "14.5%"],
        ["Fe 500", "500 MPa", "545 MPa", "12%"],
        ["Fe 550", "550 MPa", "585 MPa", "10%"],
        ["Fe 600", "600 MPa", "635 MPa", "8%"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("2", "CHEMICAL COMPOSITION")
    table_data = [
        ["Element", "Fe 415", "Fe 500", "Fe 550", "Fe 600"],
        ["Carbon (max)", "0.30%", "0.30%", "0.30%", "0.30%"],
        ["Phosphorus (max)", "0.060%", "0.055%", "0.050%", "0.045%"],
        ["Sulfur (max)", "0.060%", "0.055%", "0.050%", "0.045%"],
        ["Carbon Equivalent (max)", "0.42%", "0.44%", "0.46%", "0.48%"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("3", "TOLERANCES")
    pdf.bullet("Weight tolerance: +/- 5% of nominal weight")
    pdf.bullet("Diameter tolerance: +/- 0.7% for bars up to 20mm")
    pdf.bullet("Diameter tolerance: +/- 5% for bars over 20mm")
    pdf.bullet("Length: standard lengths of 6m, 9m, 12m (+/- 50mm)")

    pdf.section_heading("4", "TEST METHODS")
    pdf.bullet("Tensile Test: IS 1608 (Part 1) - Room Temperature Test")
    pdf.bullet("Bend Test: IS 1599 - Guide for Bend Test")
    pdf.bullet("Re-bend Test: IS 1599")
    pdf.bullet("Chemical Analysis: IS 228 (Part 1) - Wet Chemical Method")

    pdf.section_heading("5", "MARKING")
    pdf.body_text(
        "Each bar shall be legibly and durably marked at intervals not exceeding "
        "150 mm with: (a) Grade designation (Fe 500, etc.), "
        "(b) Name/abbreviation of manufacturer, "
        "(c) IS 1786 designation, (d) Size of bar."
    )

    filename = OUTPUT_DIR / "IS_1786_High_Strength_Deformed_Steel.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def create_is_456():
    """IS 456:2000 - Plain and Reinforced Concrete."""
    pdf = BISDocument()
    pdf.is_number = "IS 456:2000"
    pdf.title_page("IS 456:2000", "Plain and Reinforced Concrete", 2000, "91.100.30",
                  subtitle="Code of Practice")

    pdf.section_heading("1", "SCOPE")
    pdf.body_text(
        "This standard deals with the general construction of plain and "
        "reinforced concrete structures. It covers materials, design, "
        "and construction requirements."
    )

    pdf.section_heading("1", "CONCRETE GRADES")
    table_data = [
        ["Grade", "28-day Strength (MPa)", "Typical Use"],
        ["M10", "10", "Levelling course"],
        ["M15", "15", "PCC foundation"],
        ["M20", "20", "RCC foundations"],
        ["M25", "25", "General RCC"],
        ["M30", "30", "Pre-stressed concrete"],
        ["M35", "35", "Pre-stressed concrete"],
        ["M40", "40", "Pre-stressed concrete"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("2", "MIX PROPORTIONING")
    pdf.body_text(
        "The mix proportioning shall be done in accordance with IS 10262. "
        "The water-cement ratio shall not exceed the values given in Table 5. "
        "Minimum cement content for different exposure conditions:"
    )
    table_data = [
        ["Exposure Condition", "Min Cement (kg/m3)", "Max w/c ratio"],
        ["Mild", "220", "0.60"],
        ["Moderate", "240", "0.55"],
        ["Severe", "250", "0.50"],
        ["Very Severe", "260", "0.45"],
        ["Extreme", "280", "0.40"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("3", "WORKABILITY")
    table_data = [
        ["Place of Placement", "Slump (mm)", "Compacting Factor"],
        ["Foundations - lightly reinforced", "25-75", "0.80-0.90"],
        ["Beams and columns - normal", "75-125", "0.85-0.92"],
        ["Thin sections - congested steel", "100-150", "0.90-0.95"],
    ]
    pdf.table(table_data[0], table_data[1:])

    pdf.section_heading("4", "DURABILITY REQUIREMENTS")
    pdf.body_text(
        "The minimum grade of concrete for reinforced concrete under "
        "different exposure conditions shall be:"
    )
    pdf.bullet("Mild exposure: M20")
    pdf.bullet("Moderate exposure: M25")
    pdf.bullet("Severe exposure: M30")
    pdf.bullet("Very severe exposure: M35")
    pdf.bullet("Extreme exposure: M40")

    pdf.section_heading("5", "REINFORCEMENT")
    pdf.body_text(
        "Reinforcement shall conform to IS 1786 for high strength deformed "
        "bars and IS 432 (Part 1) for mild steel bars. The clear cover to "
        "reinforcement shall be as specified in Table 16."
    )

    pdf.section_heading("6", "QUALITY CONTROL")
    pdf.body_text(
        "The strength of concrete shall be determined by compression tests on "
        "150mm cubes at 28 days as per IS 516. For every 50 m3 or part thereof, "
        "a minimum of one cube set (3 cubes) shall be tested."
    )

    filename = OUTPUT_DIR / "IS_456_Plain_Reinforced_Concrete.pdf"
    pdf.output(str(filename))
    print(f"  Created: {filename.name}")
    return filename


def main():
    print("Generating BIS sample PDFs for ManakMitra knowledge base...")
    print(f"Output directory: {OUTPUT_DIR}\n")

    files = []
    files.append(create_is_269())
    files.append(create_is_1786())
    files.append(create_is_456())
    files.append(create_is_1489())
    files.append(create_is_2062())
    files.append(create_is_13252())
    files.append(create_is_14543())
    files.append(create_is_1758())
    files.append(create_is_383())
    files.append(create_is_2185())
    files.append(create_is_12040())
    files.append(create_is_16001())
    files.append(create_is_455())

    print(f"\nDone! Generated {len(files)} PDFs.")
    print("Files:")
    for f in files:
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
