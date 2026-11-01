import { Request, Response, NextFunction } from 'express';
import { BenefitModel, IBenefitRow } from '../models/benefit.model';

const DEFAULT_BENEFIT_ROWS: IBenefitRow[] = [
  {
    id: 'benefit-1',
    feature: 'Peanut Quality & Sourcing',
    nuttryx: '100% Saurashtra Jumbo Bold Peanuts (Grade A)',
    regular: 'Unspecified split & low-grade bulk peanuts',
    nuttryxWins: true,
    order: 1,
    isActive: true
  },
  {
    id: 'benefit-2',
    feature: 'Hydrogenated Palm Oil / Stabilizers',
    nuttryx: 'ZERO (Never Used - 100% Natural Oil)',
    regular: 'Used heavily to artificially stop oil separation',
    nuttryxWins: true,
    order: 2,
    isActive: true
  },
  {
    id: 'benefit-3',
    feature: 'Added Refined White Sugar',
    nuttryx: '0g (Zero Added Sugar or Glucose Syrup)',
    regular: '15g - 22g hidden sugars & syrups',
    nuttryxWins: true,
    order: 3,
    isActive: true
  },
  {
    id: 'benefit-4',
    feature: 'Pure Protein per 100g',
    nuttryx: '30g Authentic Natural Plant Protein',
    regular: 'Diluted to 18g - 22g due to fillers',
    nuttryxWins: true,
    order: 4,
    isActive: true
  },
  {
    id: 'benefit-5',
    feature: 'Trans Fats & Preservatives',
    nuttryx: '0.0g Trans Fat • Zero Chemical Preservatives',
    regular: 'Often contains trace hydrogenated trans fats',
    nuttryxWins: true,
    order: 5,
    isActive: true
  },
  {
    id: 'benefit-6',
    feature: 'Roasting & Grinding Process',
    nuttryx: 'Precision Hot-Air Slow Roasted & Stone Milled',
    regular: 'Industrial high-heat flash scorching',
    nuttryxWins: true,
    order: 6,
    isActive: true
  }
];

export class BenefitController {
  // GET /api/benefit - Returns benefit comparison section (auto-seeds if missing)
  async getBenefits(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let doc = await BenefitModel.findOne({ key: 'main_benefit' });

      if (!doc) {
        doc = await BenefitModel.create({
          key: 'main_benefit',
          badge: 'The Clean Label Revolution',
          heading: 'Why NUTTRYX Wins Hands Down',
          description:
            'We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.',
          footerBanner:
            'Certified under FSSAI regulations and tested in NABL accredited food testing laboratories.',
          footerLinkText: 'Try Pure Taste →',
          footerLinkUrl: '#products',
          rows: DEFAULT_BENEFIT_ROWS,
          isActive: true
        });
      } else if (!doc.rows || doc.rows.length === 0) {
        doc.rows = DEFAULT_BENEFIT_ROWS;
        await doc.save();
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({
        success: true,
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/benefit - Update header, footer, or full rows
  async updateBenefitSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { badge, heading, description, footerBanner, footerLinkText, footerLinkUrl, rows, isActive } = req.body;

      let doc = await BenefitModel.findOne({ key: 'main_benefit' });
      if (!doc) {
        doc = new BenefitModel({ key: 'main_benefit', rows: DEFAULT_BENEFIT_ROWS });
      }

      if (badge !== undefined) doc.badge = badge.trim();
      if (heading !== undefined) doc.heading = heading.trim();
      if (description !== undefined) doc.description = description.trim();
      if (footerBanner !== undefined) doc.footerBanner = footerBanner.trim();
      if (footerLinkText !== undefined) doc.footerLinkText = footerLinkText.trim();
      if (footerLinkUrl !== undefined) doc.footerLinkUrl = footerLinkUrl.trim();
      if (isActive !== undefined) doc.isActive = Boolean(isActive);

      if (Array.isArray(rows)) {
        doc.rows = rows;
      }

      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Benefit section updated successfully',
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/benefit/rows - Add a comparison row
  async addRow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { feature, nuttryx, regular, nuttryxWins, order } = req.body;

      if (!feature || !nuttryx || !regular) {
        res.status(400).json({
          success: false,
          message: 'feature, nuttryx, and regular are required fields'
        });
        return;
      }

      let doc = await BenefitModel.findOne({ key: 'main_benefit' });
      if (!doc) {
        doc = new BenefitModel({ key: 'main_benefit', rows: DEFAULT_BENEFIT_ROWS });
      }

      const newRowId = `benefit-${Date.now()}`;
      const newRow: IBenefitRow = {
        id: newRowId,
        feature: feature.trim(),
        nuttryx: nuttryx.trim(),
        regular: regular.trim(),
        nuttryxWins: nuttryxWins !== undefined ? Boolean(nuttryxWins) : true,
        order: Number(order) || doc.rows.length + 1,
        isActive: true
      };

      doc.rows.push(newRow);
      doc.rows.sort((a, b) => (a.order || 0) - (b.order || 0));

      await doc.save();

      res.status(201).json({
        success: true,
        message: 'Comparison row added successfully',
        data: newRow,
        section: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/benefit/rows/:id - Update an existing row
  async updateRow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { feature, nuttryx, regular, nuttryxWins, order, isActive } = req.body;

      const doc = await BenefitModel.findOne({ key: 'main_benefit' });
      if (!doc) {
        res.status(404).json({ success: false, message: 'Benefit section not found' });
        return;
      }

      const rowIndex = doc.rows.findIndex((r) => r.id === id);
      if (rowIndex === -1) {
        res.status(404).json({ success: false, message: `Row '${id}' not found` });
        return;
      }

      if (feature !== undefined) doc.rows[rowIndex].feature = feature.trim();
      if (nuttryx !== undefined) doc.rows[rowIndex].nuttryx = nuttryx.trim();
      if (regular !== undefined) doc.rows[rowIndex].regular = regular.trim();
      if (nuttryxWins !== undefined) doc.rows[rowIndex].nuttryxWins = Boolean(nuttryxWins);
      if (order !== undefined) doc.rows[rowIndex].order = Number(order);
      if (isActive !== undefined) doc.rows[rowIndex].isActive = Boolean(isActive);

      doc.rows.sort((a, b) => (a.order || 0) - (b.order || 0));
      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Comparison row updated successfully',
        data: doc.rows[rowIndex],
        section: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/benefit/rows/:id - Delete a row
  async deleteRow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const doc = await BenefitModel.findOne({ key: 'main_benefit' });
      if (!doc) {
        res.status(404).json({ success: false, message: 'Benefit section not found' });
        return;
      }

      const originalCount = doc.rows.length;
      doc.rows = doc.rows.filter((r) => r.id !== id);

      if (doc.rows.length === originalCount) {
        res.status(404).json({ success: false, message: `Row '${id}' not found` });
        return;
      }

      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Comparison row removed successfully',
        section: doc
      });
    } catch (error) {
      next(error);
    }
  }
}

export const benefitController = new BenefitController();

